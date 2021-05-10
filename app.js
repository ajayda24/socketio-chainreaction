const path = require('path')
const http = require('http')
const express = require('express')

const { userJoinHelper,userDeleteHelper, usersArray } = require('./utils/users')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})

const io = require('socket.io')(server)
var playerOrder = 1
io.on('connection', (socket) => {
  console.log('User has connected')

  socket.on('createGame', data => {
    const user = userJoinHelper(socket.id, data.room,data.players,playerOrder)
    socket.join(data.room)
    socket.emit('joinGameSuccess', { user: user })
    if (io.sockets.adapter.rooms.get(data.room).size == data.players) {
      io.to(data.room).emit('startGame', { room: data.room, user: user })
    }
    
  })

  socket.on('joinGame', data => {
    const checkRoom = usersArray.find((el) => el.room == data.room)
    if (checkRoom) {
      playerOrder++
      const user = userJoinHelper(socket.id, data.room, checkRoom.players,playerOrder)
      socket.join(data.room)
      const us = usersArray.find((el) => el.id == socket.id)
      socket.emit('joinGameSuccess',{user:user})
      if (io.sockets.adapter.rooms.get(data.room).size == checkRoom.players) {
        
        io.to(data.room).emit('startGame', { room: data.room, user: user })
        socket.emit('firstPlayer')
      } else {
        socket.emit('waitForPlayers', { room: data.room, user: user })
      }
    } else {
      console.log('Room not Exist');
      socket.emit('roomNotExist')
    }
  })

  var nextPlayerNumber

  socket.on('playGame', data => {
    socket.broadcast.to(data.room).emit('gameBoxClick', { btnInfo: data.btnInfo, room: data.room, players: data.players, playerId: socket.id })
    
    const currentPlayer = usersArray.filter(el => el.order == data.playerOrder)[0]
    nextPlayerNumber = currentPlayer.order+1
    if (nextPlayerNumber > data.players) {
      nextPlayerNumber = 1
    }
    const nextPlayer = usersArray.filter((el) => el.order == nextPlayerNumber)[0]
    socket.to(`${nextPlayer.id}`).emit('nextPlayer')
    socket.emit('playerWhoClicked')
  })
})
