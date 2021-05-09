
const usersArray = []

const userJoinHelper = (id,room,players) => {
  const user = { id, room, players}
  usersArray.push(user)
  return user
}

const userDeleteHelper = (id) => {
  const index = usersArray.findIndex(el => el.id == id)
  if (index >= 0) {
    usersArray.splice(index,1)
  }
}

module.exports = { userJoinHelper, userDeleteHelper, usersArray }