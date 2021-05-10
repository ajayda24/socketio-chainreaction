const usersObj = {}

// var q = {
//   room1: [
//     { id: 1, room: 'room1', players: 3, order: 1 },
//     { id: 2, room: 'room1', players: 3, order: 2 },
//     { id: 3, room: 'room1', players: 3, order: 3 },
//   ],
//   room2: [
//     { id: 1, room: 'room2', players: 2, order: 1 },
//     { id: 2, room: 'room2', players: 2, order: 2 },
//   ],
// }

const userJoinHelper = (id, room, players, order) => {
  if (!usersObj[room]) {
    usersObj[room] = []
  }
  const user = { id, room, players, order }
  usersObj[room].push(user)
  return user
}

const userDeleteHelper = (id) => {
  const index = usersArray.findIndex((el) => el.id == id)
  if (index >= 0) {
    usersArray.splice(index, 1)
  }
}

module.exports = { userJoinHelper, userDeleteHelper, usersObj }
