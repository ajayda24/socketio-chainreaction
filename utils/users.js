
const usersArray = []

const userJoinHelper = (id,room,players,order) => {
  const user = { id, room, players,order}
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