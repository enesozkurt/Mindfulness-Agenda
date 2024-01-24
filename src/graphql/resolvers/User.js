const { activities } = require('../../data');

const User = {
    activities: (parent) => {
      return activities.filter(activity => activity.userId === parent.id)
    }
}

module.exports.User = User;