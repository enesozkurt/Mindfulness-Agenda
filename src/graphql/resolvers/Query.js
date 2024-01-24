const { users, activities } = require('../../data');

const Query = {
    users: () => users,
    user: (parent, args) => {
      const data = users.find((user) => user.id === args.id);
      return data;
    },
    activities: () => activities,
    activity: (parent, args) => {
      const data = activities.find((activity) => activity.date === args.date)
      return data;
    }
  }

  module.exports.Query = Query;   