const pubSub = require("../../pubsub");

const Subscription = {
  activityCreated: {
    subscribe: () => pubSub.asyncIterator("activityCreated"),
    resolve: (payload) => payload,
  },
  activityUpdated: {
    subscribe: () => pubSub.asyncIterator("activityUpdated"),
    resolve: (payload) => payload,
  },
  activityDeleted: {
    subscribe: () => pubSub.asyncIterator("activityDeleted"),
    resolve: (payload) => payload,
  },
};

module.exports.Subscription = Subscription;
