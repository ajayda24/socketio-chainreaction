const socket = io()

var row = 6
var col = 9
var playernumber = 1
var charaterArry = [
  '.',
  '๐',
  '๐ฏ',
  '๐ฝ',
  '๐ช',
  '๐ป',
  '๐',
  '๐',
  '๐งก',
  '๐',
  '๐',
  '๐',
  '๐',
  '๐ค',
  '๐ค',
  'โฝ',
  '๐',
  '๐ด',
  '๐ ',
  '๐ก',
  '๐ข',
  '๐ต',
  '๐ฃ',
  '๐ค',
  'โซ',
  '๐ฑ',
]
var numberOfPlayer = 2

var currentPlayers = []
for (let p = 1; p <= numberOfPlayer; p++) {
  currentPlayers.push(charaterArry[p])
}

var emojiNumberPerBox = []

function on() {
  document.getElementById('game').style.pointerEvents = 'none'
  document.getElementById('game').style.opacity = '0.4'

  document.querySelector('body').style.height = '100vh'
  document.querySelector('body').style.overflow = 'hidden'
  document.getElementById('overlay').style.display = 'inline-block'

  document.getElementById('overlay-gameover').style.display = 'none'

  const { j } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  })
  if (j) {
    document.getElementById('players-input').value = j

    socket.emit('joinGame', { room: j })
    socket.on('waitForPlayers', (data) => {
      document.getElementById('chain-reaction-heading').innerHTML =
        'Waiting for Other Users to join ... '
      document.getElementById('players-input').placeholder = data.room
      document.getElementById('players-input').disabled = true
      document.getElementById('joinCodeShareLink').style.display = 'block'
      document
        .getElementById('joinCodeShareLink')
        .setAttribute(
          'href',
          `https://socketio-second.herokuapp.com/?j=${data.room}`
        )
      document.getElementById('startGame').setAttribute('disabled', 'true')
    })
  }
}

function off(roomId) {
  var p = document.getElementById('players-input').value
  p = Number(p)
  if (p == 0) numberOfPlayer = 2
  else if (p <= 25) numberOfPlayer = p
  else numberOfPlayer = 25

  if (numberOfPlayer >= 2) {
    currentPlayers.length = 0
    for (let p = 1; p <= numberOfPlayer; p++) {
      currentPlayers.push(charaterArry[p])
    }
  }

  var joinCode = roomId
  if (!roomId) {
    joinCode = Math.random().toString(36).substr(2, 5)
  }
  socket.emit('createGame', { players: numberOfPlayer, room: joinCode })

  document.getElementById('chain-reaction-heading').innerHTML =
    'Waiting for Other Users to join ... '
  document.getElementById('players-input').value = joinCode
  document.getElementById('players-input').disabled = true
  document.getElementById('joinCodeShareLink').style.display = 'block'
  document
    .getElementById('joinCodeShareLink')
    .setAttribute(
      'href',
      `https://socketio-second.herokuapp.com/?j=${joinCode}`
    )
  document.getElementById('startGame').style.display = 'none'
  document.getElementById('joinGameBtn').style.display = 'none'
}

function joinGame() {
  const j = document.getElementById('players-input').value
  socket.emit('joinGame', { room: j })
  socket.on('roomNotExist', () => {
    document.getElementById('players-input').value = 'Code is Invalid'
  })
  socket.on('waitForPlayers', (data) => {
    document.getElementById('chain-reaction-heading').innerHTML =
      'Waiting for Other Users to join ... '
    document.getElementById('players-input').placeholder = data.room
    document.getElementById('players-input').disabled = true
    document.getElementById('joinCodeShareLink').style.display = 'block'
    document
      .getElementById('joinCodeShareLink')
      .setAttribute(
        'href',
        `https://socketio-second.herokuapp.com/?j=${data.room}`
      )
    document.getElementById('startGame').setAttribute('disabled', 'true')
  })
}

socket.on('joinGameSuccess', (data) => {
  document.getElementById('playerOrderInfo').innerHTML = data.user.order
})

socket.on('startGame', (data) => {
  numberOfPlayer = data.user.players
  // document.getElementById('game').style.pointerEvents = 'auto'

  

  // document.getElementById('game').style.opacity = '1'
  document.getElementById('overlay').style.display = 'none'

  document.getElementById('roomInfo').innerHTML = 'Join Code : ' + data.room
  document.getElementById('playersInfo').innerHTML =
    'Players : ' + data.user.players

  document.getElementById('game').style.pointerEvents = 'none'
  document.getElementById('game').style.opacity = '0.4'

  document.getElementById('chatBtnId').style.pointerEvents = 'auto'

  socket.on('firstPlayer', (data) => {
    document.getElementById('game').style.pointerEvents = 'auto'
    document.getElementById('game').style.opacity = '1'

    document.getElementById('chatBtnId').style.pointerEvents = 'auto'

    setTimeout(() => {
      socket.emit('playerTakeMoreTime', { emoji: data.emoji,room:data.room })
    }, 7000)
  })
})

function gameOverTwoPlayer(player) {
  document.getElementById('game').style.pointerEvents = 'none'
  document.getElementById('game').style.opacity = '0.4'

  document.querySelector('body').style.height = '100vh'
  document.querySelector('body').style.overflow = 'hidden'
  document.getElementById('overlay-gameover').style.display = 'block'
  document.getElementById('winner').innerHTML = player + ' Lose'
}

function gameOverMultiplePlayer(player) {
  console.log(player)
  // numberOfPlayer--
  // currentPlayers = currentPlayers.filter((el) => el != player)
  // charaterArry = currentPlayers
}

var n = row * col
var Values = new Array(n + 1).fill(0)
var playerPosition = new Array(n + 1).fill(0)

for (var i = 1; i < col * row + 1; i++) {
  var btn = document.createElement('BUTTON')
  document.getElementById('game').appendChild(btn)
  btn.id = i
  document.getElementById(i).classList.add('box1')

  btn.setAttribute('class', 'center')
  btn.setAttribute('onClick', 'buttonClick(this)')

  if (i % row == 0) {
    // creating space

    var br = document.createElement('br')
    document.getElementById('game').appendChild(br)
  }

  if (i == 1) {
    btn.setAttribute('class', 'cornerOne')
  }
  if (i == row) {
    btn.setAttribute('class', 'cornerTwo')
  }
  if (i == n - row + 1) {
    btn.setAttribute('class', 'cornerThree')
  }
  if (i == n) {
    // marking the corners

    btn.setAttribute('class', 'cornerFour')
  }
  if (i > 1 && i < row) {
    btn.setAttribute('class', 'sideTop')
  }
  if (i % row == 0 && i != row && i != n) {
    btn.setAttribute('class', 'sideRight')
  }
  if ((i - 1) % row == 0 && i != 1 && i != n - row + 1) {
    btn.setAttribute('class', 'sideLeft')
  }
  if (i > n - row + 1 && i < n) {
    btn.setAttribute('class', 'sideDown')
  }
}

var roomId = document.getElementById('roomInfo').innerHTML.substring(12)
var chatBtn = document.createElement('img')
chatBtn.setAttribute('src', 'https://img.icons8.com/carbon-copy/2x/chat.png')
chatBtn.setAttribute('id', 'chatBtnId')
chatBtn.setAttribute('class', 'chatBtn')
chatBtn.setAttribute('onClick', `chatWindow(${roomId})`)
chatBtn.innerHTML = 'Chat'
document.getElementById('gameInfo').appendChild(chatBtn)

var notificationRed = document.createElement('p')
notificationRed.setAttribute('class', 'notifyRed')
notificationRed.setAttribute('id', 'notifyRedId')
notificationRed.style.display = 'none'
document.getElementById('gameInfo').appendChild(notificationRed)

socket.on('gameBoxClick', (data) => {
  ChainReaction(data.btnInfo)
  chainReactionOutputAndGameOver()
})

socket.on('nextPlayer', (data) => {
  document.getElementById('game').style.pointerEvents = 'auto'
  document.getElementById('game').style.opacity = '1'

  document.getElementById('chatBtnId').style.pointerEvents = 'auto'

  setTimeout(() => {
    socket.emit('playerTakeMoreTime',{emoji:data.emoji,room:data.room})
  },7000)
})

socket.on('playerWhoClicked', (data) => {
  document.getElementById('game').style.pointerEvents = 'none'
  document.getElementById('game').style.opacity = '0.4'

  document.getElementById('chatBtnId').style.pointerEvents = 'auto'
})

function buttonClick(f) {
  if (numberOfPlayer == 0) numberOfPlayer = 2
  if (numberOfPlayer > 25) numberOfPlayer = 25

  const roomId = document.getElementById('roomInfo').innerHTML.substring(12)
  const players = document.getElementById('playersInfo').innerHTML.substring(10)

  const btnInfo = { className: f.className, id: f.id }
  const playerOrderInfo = document.getElementById('playerOrderInfo').innerHTML
  if (playerPosition[f.id] == playernumber || playerPosition[f.id] == 0) {
    socket.emit('playGame', {
      btnInfo: btnInfo,
      room: roomId,
      players: players,
      playerOrder: playerOrderInfo,
    })

    ChainReaction(f)
    chainReactionOutputAndGameOver()
  }
}

function ChainReaction(e) {
  var c = e.className
  var z = e.id
  if (playerPosition[z] == playernumber || playerPosition[z] == 0) {
    var dotMinusOne = Values[e.id]

    function cornerOne(id) {
      var element = document.getElementById(id)
      var classes = element.className
      if (classes == 'cornerOne') {
        var dot = Values[id] + 1
        Values[id] = dot
        playerPosition[id] = playernumber
        if (dot > 1) {
          dot = 0
          playerPosition[id] = 0
          Values[id] = dot
          var t = 2
          var u = Number(id) + row

          sideTop(t)
          sideLeft(u)
        }
      }
    }

    function sideTop(id) {
      var element = document.getElementById(id)
      var classes = element.className
      if (classes == 'sideTop') {
        var dot = Values[id] + 1
        Values[id] = dot
        playerPosition[id] = playernumber
        if (dot > 2) {
          dot = 0
          playerPosition[id] = 0
          Values[id] = dot
          var t = Number(id) + 1
          var u = Number(id) - 1
          var v = Number(id) + row
          cornerOne(u)
          cornerTwo(t)
          sideTop(t)
          sideTop(u)
          center(v)
        }
      }
    }
    function cornerTwo(id) {
      var element = document.getElementById(id)
      var classes = element.className
      if (classes == 'cornerTwo') {
        var dot = Values[id] + 1
        Values[id] = dot
        playerPosition[id] = playernumber
        if (dot > 1) {
          dot = 0
          playerPosition[id] = 0
          Values[id] = dot
          var t = Number(id) - 1
          var u = Number(id) + row
          sideTop(t)
          sideRight(u)
        }
      }
    }
    function sideLeft(id) {
      var element = document.getElementById(id)
      var classes = element.className
      if (classes == 'sideLeft') {
        var dot = Values[id] + 1
        Values[id] = dot
        playerPosition[id] = playernumber
        if (dot > 2) {
          dot = 0
          playerPosition[id] = 0
          Values[id] = dot
          var t = Number(id) - row
          var u = Number(id) + row
          var v = Number(id) + 1
          cornerOne(t)
          sideLeft(u)
          sideLeft(t)
          center(v)
          cornerThree(u)
        }
      }
    }
    function center(id) {
      var element = document.getElementById(id)

      var classes = element.className
      if (classes == 'center') {
        var dot = Values[id] + 1
        Values[id] = dot
        playerPosition[id] = playernumber
        if (dot > 3) {
          dot = 0
          playerPosition[id] = 0
          Values[id] = dot
          var t = Number(id) - row
          var u = Number(id) + row
          var v = Number(id) + 1
          var w = Number(id) - 1
          sideLeft(w)
          center(t)
          center(u)
          center(v)
          center(w)
          sideTop(t)
          sideRight(v)
          sideDown(u)
        }
      }
    }
    function sideRight(id) {
      var element = document.getElementById(id)
      var classes = element.className
      if (classes == 'sideRight') {
        var dot = Values[id] + 1
        Values[id] = dot
        playerPosition[id] = playernumber
        if (dot > 2) {
          dot = 0
          playerPosition[id] = 0
          Values[id] = dot
          var t = Number(id) - row
          var u = Number(id) + row
          var v = Number(id) - 1
          cornerTwo(t)
          cornerFour(u)
          center(v)
          sideRight(t)
          sideRight(u)
        }
      }
    }
    function cornerThree(id) {
      var element = document.getElementById(id)
      var classes = element.className
      if (classes == 'cornerThree') {
        var dot = Values[id] + 1
        Values[id] = dot
        playerPosition[id] = playernumber
        if (dot > 1) {
          dot = 0
          playerPosition[id] = 0
          Values[id] = dot
          var t = Number(id) + 1
          var u = Number(id) - row
          sideDown(t)
          sideLeft(u)
        }
      }
    }
    function sideDown(id) {
      var element = document.getElementById(id)
      var classes = element.className
      if (classes == 'sideDown') {
        var dot = Values[id] + 1
        Values[id] = dot
        playerPosition[id] = playernumber
        if (dot > 2) {
          dot = 0
          playerPosition[id] = 0
          Values[id] = dot
          var t = Number(id) - row
          var u = Number(id) + 1
          var v = Number(id) - 1
          cornerThree(v)
          cornerFour(u)
          sideDown(u)
          sideDown(v)
          center(t)
        }
      }
    }
    function cornerFour(id) {
      var element = document.getElementById(id)
      var classes = element.className
      if (classes == 'cornerFour') {
        var dot = Values[id] + 1
        Values[id] = dot
        playerPosition[id] = playernumber
        if (dot > 1) {
          dot = 0
          playerPosition[id] = 0
          Values[id] = dot
          var t = Number(id) - 1
          var u = Number(id) - row
          sideDown(t)
          sideRight(u)
        }
      }
    }

    //calling the functions
    if (c == 'cornerOne') {
      cornerOne(e.id)
    }
    if (c == 'cornerTwo') {
      cornerTwo(e.id)
    }
    if (c == 'cornerThree') {
      cornerThree(e.id)
    }
    if (c == 'cornerFour') {
      cornerFour(e.id)
    }
    if (c == 'sideTop') {
      sideTop(e.id)
    }
    if (c == 'sideLeft') {
      sideLeft(e.id)
    }
    if (c == 'sideRight') {
      sideRight(e.id)
    }
    if (c == 'sideDown') {
      sideDown(e.id)
    }
    if (c == 'center') {
      center(e.id)
    }
    for (var j = 1; j <= n; j++) {
      document.getElementById(j).innerHTML = Values[j]
    }
    playernumber++
    if (playernumber == numberOfPlayer + 1) {
      playernumber = 1
    }
  }
}

function chainReactionOutputAndGameOver() {
  for (var j = 1; j <= n; j++) {
    if (Values[j] == 0) {
      document.getElementById(j).style.color = 'white'
      document.getElementById(j).innerHTML = 'โ'
    }
    if (Values[j] == 1) {
      // document.getElementById(`span-${j}`).style.position = 'absolute'
      document.getElementById(j).innerHTML = `<span id='span-${j}-1'>${
        charaterArry[playerPosition[j]]
      }</span>`
    }
    if (Values[j] == 2) {
      document.getElementById(j).innerHTML = `<span id='span-${j}-1'>${
        charaterArry[playerPosition[j]]
      }</span><span id='span-${j}-2'>${charaterArry[playerPosition[j]]}</span>`
      document.getElementById(`span-${j}-1`).style.position = 'absolute'
      document.getElementById(`span-${j}-1`).style.left = '0.7rem'
    }
    if (Values[j] == 3) {
      document.getElementById(j).innerHTML = `<span id='span-${j}-1'>${
        charaterArry[playerPosition[j]]
      }</span><span id='span-${j}-2'>${
        charaterArry[playerPosition[j]]
      }</span><span id='span-${j}-3'>${charaterArry[playerPosition[j]]}</span>`
      document.getElementById(`span-${j}-1`).style.position = 'absolute'
      document.getElementById(`span-${j}-1`).style.top = '0.4rem'
      document.getElementById(`span-${j}-1`).style.right = '1rem'
      document.getElementById(`span-${j}-2`).style.position = 'absolute'
      document.getElementById(`span-${j}-2`).style.left = '1rem'
      document.getElementById(`span-${j}-2`).style.top = '0.4rem'
      document.getElementById(`span-${j}-3`).style.position = 'relative'
      document.getElementById(`span-${j}-3`).style.zIndex = '1'
    }
  }

  emojiNumberPerBox.length = 0
  for (let t = 1; t < row * col + 1; t++) {
    if (document.getElementById(t).children.length > 0) {
      for (let y = 0; y < document.getElementById(t).children.length; y++) {
        for (let q = 0; q < currentPlayers.length; q++) {
          if (
            document.getElementById(t).children[y].innerHTML ==
            currentPlayers[q]
          ) {
            emojiNumberPerBox.push(
              document.getElementById(t).children[y].innerHTML
            )
          }
        }
      }
    }
  }

  if (emojiNumberPerBox.length >= currentPlayers.length) {
    loop1: for (let u = 0; u < emojiNumberPerBox.length; u++) {
      loop2: for (let q = 0; q < currentPlayers.length; q++) {
        if (emojiNumberPerBox.indexOf(currentPlayers[q]) < 0) {
          if (currentPlayers.length == 2) {
            gameOverTwoPlayer(currentPlayers[q])
          } else {
            let uniqueChars = [...new Set(emojiNumberPerBox)]
            if (uniqueChars.length == 1) gameOverTwoPlayer(currentPlayers[q])
            if (currentPlayers.length - uniqueChars.length >= 1) {
              // console.log(uniqueChars)
              currentPlayers = uniqueChars
              numberOfPlayer = currentPlayers.length
              var charArrayReverse = [...currentPlayers].reverse()
              playernumber = 2
              console.log(playernumber)
              charaterArry = [
                '.',
                ...currentPlayers,
                '1๏ธโฃ',
                '2๏ธโฃ',
                '3๏ธโฃ',
                '4๏ธโฃ',
                '5๏ธโฃ',
                '6๏ธโฃ',
                '7๏ธโฃ',
                '8๏ธโฃ',
                '9๏ธโฃ',
                '๐',
              ]

            }
          }
        }
      }
    }
  }
}


function chatWindow(rId) {
  const chatOverlay = document.getElementById('overlay-chat')
  chatOverlay.style.display = 'inline-block'

  const chatBox = document.getElementById('chat-div')
  chatBox.scrollTop = chatBox.scrollHeight

  document.getElementById('chatBtnId').setAttribute('onClick', 'closeChat()')
  document.getElementById('notifyRedId').style.display = 'none'
  const chatInput = document.getElementById('chat-input')
  chatInput.focus()
}

function closeChat() {
  document.getElementById('overlay-chat').style.display = 'none'
  document.getElementById('chatBtnId').setAttribute('onClick', 'chatWindow()')
}

function chatSubmit() {
  const roomInfo = document.getElementById('roomInfo').innerHTML.substring(12)
  const chatInput = document.getElementById('chat-input').value

  socket.emit('newChat', { room: roomInfo, chat: chatInput })
  setTimeout(() => {
    closeChat()
  },2000)
}

socket.on('chatRoom', (data) => {
  document.getElementById('chat-input').value = ''
  
  const chatBox = document.getElementById('chat-div')
  const p = document.createElement('p')
  p.setAttribute('class', 'chatContent')
  p.innerHTML = `${data.user.emoji} - ${data.chat}`
  chatBox.appendChild(p)
  chatBox.scrollTop = chatBox.scrollHeight
})

socket.on('showNotification', () => {
  document.getElementById('notifyRedId').style.display = 'block'
})

socket.on('gameInfo', data => {
  if (data.action == 'info') {
    document.getElementById('gameInfoContent').innerHTML = `${data.emoji}'s Move`
  } else if (data.action == 'time') {
    document.getElementById('gameInfoContent').innerHTML = `${data.emoji} is taking more time`
  }
})

socket.on('playerDisconnect', () => {
  document.getElementById('overlay').style.display = 'block'
  document.getElementById('chain-reaction-heading').innerHTML =
    'Your Friend Left the game'
  document.getElementById('players-input').style.display = 'none'
  document.getElementById('joinCodeShareLink').style.display = 'none'
  document.getElementById('startGame').style.display = 'none'
  document.getElementById('joinGameBtn').style.display = 'block'
  document.getElementById('joinGameBtn').setAttribute('onclick','window.location.reload()')
  document.getElementById('joinGameBtn').innerHTML = 'Play Again'

  // document.getElementById('chain-reaction-heading').innerHTML =
  //   'Your Friend Left the game '
  // document.getElementById('players-input').placeholder = data.room
  // document.getElementById('players-input').disabled = true
  // document.getElementById('joinCodeShareLink').style.display = 'block'
  // document.getElementById('startGame').setAttribute('disabled', 'true')
})

