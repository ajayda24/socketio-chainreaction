const path = require('path')
const http = require('http')
const express = require('express')

const { userJoinHelper, userDeleteHelper, usersObj } = require('./utils/users')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})

const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('User has connected')

  socket.on('createGame', data => {
    const user = userJoinHelper(socket.id, data.room,data.players,1)
    socket.join(data.room)
    socket.emit('joinGameSuccess', { user: user })
    if (io.sockets.adapter.rooms.get(data.room).size == data.players) {
      io.to(data.room).emit('startGame', { room: data.room, user: user })
    }
  })

  socket.on('joinGame', data => {

    const checkRoom = Object.keys(usersObj).find((el) => el == data.room)
    if (checkRoom) {
      const checkRoomPlayers = usersObj[checkRoom][0].players
      const checkRoomOrder = Math.max.apply(
        Math,
        usersObj[checkRoom].map(function (o) {
          return o.order
        })
      )
      const user = userJoinHelper(
        socket.id,
        data.room,
        checkRoomPlayers,
        checkRoomOrder+1
      )
      socket.join(data.room)
      socket.emit('joinGameSuccess',{user:user})
      if (io.sockets.adapter.rooms.get(data.room).size == checkRoomPlayers) {
        io.to(data.room).emit('startGame', { room: data.room, user: user })
        const firstPlayer = usersObj[checkRoom].filter(el => el.order == 1)
        const firstPlayerId = firstPlayer[0].id
        io.to(data.room).emit('gameInfo', {action:'info',emoji: firstPlayer[0].emoji })
        socket.to(`${firstPlayerId}`).emit('firstPlayer',{room:data.room,emoji:firstPlayer[0].emoji})
      } else {
        socket.emit('waitForPlayers', { room: data.room, user: user })
      }
    } else {
      console.log('Room not Exist');
      socket.emit('roomNotExist')
    }
  })


  socket.on('playGame', data => {
    socket.broadcast.to(data.room).emit('gameBoxClick', { btnInfo: data.btnInfo, room: data.room, players: data.players, playerId: socket.id })
    
    const roomArray = usersObj[data.room]

    const currentPlayer = roomArray.filter(
      (el) => el.order == data.playerOrder
    )[0]
    var nextPlayerNumber = currentPlayer.order+1
    if (nextPlayerNumber > data.players) {
      nextPlayerNumber = 1
    }

    const nextPlayer = roomArray.filter(
      (el) => el.order == nextPlayerNumber
    )[0]


    socket.to(`${nextPlayer.id}`).emit('nextPlayer',{btnInfo:data.btnInfo,emoji:nextPlayer.emoji,room:data.room})
    socket.emit('playerWhoClicked')
    io.to(data.room).emit('gameInfo', { action: 'info', emoji: nextPlayer.emoji })

    socket.on('disconnect', () => {
      userDeleteHelper(socket.id,data.room)
      io.to(data.room).emit('playerDisconnect', { room: data.room })
    })
  })

  socket.on('newChat', data => {
    const user = usersObj[data.room].filter(el => el.id == socket.id)[0]
    io.to(data.room).emit('chatRoom',{chat:data.chat,user:user})
    socket.to(data.room).emit('showNotification')
  })

  socket.on('playerTakeMoreTime', (data) => {
    socket.broadcast.to(data.room).emit('gameInfo', { action: 'time', emoji: data.emoji })
  })

  

})
