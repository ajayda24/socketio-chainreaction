const { userJoinHelper, userDeleteHelper, usersObj } = require('./utils/users')
userJoinHelper(1, 'room1', 2, 1)
userJoinHelper(2, 'room1', 2, 2)
userJoinHelper(5, 'room2', 3, 1)
userJoinHelper(6, 'room2', 3, 2)
userJoinHelper(7, 'room2', 3, 3)
console.log(usersObj)