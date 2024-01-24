const { users } = require('../../data');

const Activity = {
    user: (parent) => {
      return users.find(user => user.id === parent.userId)
    }
}

module.exports.Activity = Activity