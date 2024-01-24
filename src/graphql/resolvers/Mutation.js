const { nanoid } = require('nanoid');
const { users, activities } = require('../../data');
const pubSub = require("../../pubsub");

const Mutation = {
    register: (parent, { data }) => {
      const newUser = { id: nanoid(), ...data }
      users.push(newUser)

      return newUser;
    },
    updateUser: (parent, { id, data }) => {
      const user_index = users.findIndex(user => user.id === id)

      if (user_index === -1) {
        throw new Error('User not found!')
      }

      const updatedUser = users[user_index] = {
        ...users[user_index],
        ...data
      }

      return updatedUser;
    },
    createActivity: (parent, { data }) => {
      const newActivity = { id: nanoid(), ...data }
      activities.push(newActivity);

      pubSub.publish('activityCreated', newActivity)

      return newActivity;
    },
    updateActivity: (parent, { id, data}) => {
      const activity_index = activities.findIndex(activity => activity.id === id)

      if (activity_index === -1) {
        throw new Error('Activity not found!')
      }

      const updatedActivitiy = activities[activity_index] = {
        ...activities[activity_index],
        ...data
      }

      pubSub.publish('activityUpdated', updatedActivitiy)

      return updatedActivitiy;
    },
    deleteActivity: (parent, { id }) => {
      const activity_index = activities.findIndex(activity => activity.id === id);

      if (activity_index === -1) {
        throw new Error('Activity not found!')
      }

      const deletedActivitiy = activities[activity_index]
      activities.splice(activity_index, 1)

      pubSub.publish('activityDeleted', deletedActivitiy)

      return deletedActivitiy
    },
    deleteAllActivities: () => {
      const length = activities.length
      activities.splice(0, length)

      return {
        count: length
      }
    }
  }

  module.exports.Mutation = Mutation;