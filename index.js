const { createServer } = require('node:http')
const { createPubSub, createSchema, createYoga } = require('graphql-yoga')

const { users, activities } = require('./data');
const { nanoid } = require('nanoid');
 
const pubSub = createPubSub()

const yoga = createYoga({
  schema: createSchema({
    typeDefs: `
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  
    # This "User" type defines the queryable fields for every user in our data source.
    type User {
      id: ID!
      firstName: String!
      lastName: String!
      activities(filter: String): [Activity]!
    }
  
    input CreateUserInput {
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    }
  
    input UpdateUserInput {
      firstName: String
      lastName: String
      password: String
    }
  
    type Activity {
      id: ID!
      userId: ID!
      user: User!
      date: String!
      wakeUpTime: String
      didYouEatHealthy: Boolean
      didYouDoSport: Boolean
      litresOfDrinkingWater: Float
      todoList: [TodoList!]
      notes: [Notes!]
    }
  
    input CreateActivityInput {
      userId: ID!
      date: String!
      wakeUpTime: String
      didYouEatHealthy: Boolean
      didYouDoSport: Boolean
      litresOfDrinkingWater: Float
      todoList: [CreateTodoInput!]
      notes: [CreateNoteInput!]
    }
  
    input UpdateActivityInput {
      date: String
      wakeUpTime: String
      didYouEatHealthy: Boolean
      didYouDoSport: Boolean
      litresOfDrinkingWater: Float
      todoList: [CreateTodoInput!]
      notes: [CreateNoteInput!]
    }
  
    type TodoList {
      id: ID!
      todo: String
    }
  
    input CreateTodoInput {
      id: ID!
      todo: String
    }
  
    type Notes {
      id: ID!
      note: String
    }
    
    input CreateNoteInput {
      id: ID!
      note: String
    }
  
    type DeleteAllOutput {
      count: Int!
    }

    type Subscription {
      activityCreated: Activity!
      activityUpdated: Activity!
      activityDeleted: Activity!
    }
  
    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "users" query returns an array of zero or more Users (defined above).
    type Query {
      users: [User!]!
      user(id: ID!): User!
      activities: [Activity]!
      activity(date: String!): Activity!
    }
  
    type Mutation {
      register(data: CreateUserInput!): User!
      createActivity(data: CreateActivityInput!): Activity!
      updateActivity(id: ID!, data: UpdateActivityInput!): Activity!
      updateUser(id: ID!, data: UpdateUserInput!): User!
      deleteActivity(id: ID!): Activity!
      deleteAllActivities: DeleteAllOutput!
    }
  `,
  resolvers: {
    Subscription: {
      activityCreated: {
        subscribe: () => pubSub.subscribe('activityCreated'),
        resolve: payload => payload
      },
      activityUpdated: {
        subscribe: () => pubSub.subscribe('activityUpdated'),
        resolve: payload => payload
      },
      activityDeleted: {
        subscribe: () => pubSub.subscribe('activityDeleted'),
        resolve: payload => payload
      }
    },
    Mutation: {
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
    },
    Query: {
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
    },
    Activity: {
      user: (parent) => {
        return users.find(user => user.id === parent.userId)
      }
    },
    User: {
      activities: (parent) => {
        return activities.filter(activity => activity.userId === parent.id)
      }
    }
  }
  })
})

const server = createServer(yoga)
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})