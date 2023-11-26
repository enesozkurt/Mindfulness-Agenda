const { ApolloServer } =  require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { users, activities } = require('./data');
const { nanoid } = require('nanoid');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "User" type defines the queryable fields for every user in our data source.
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    activities(filter: String): [Activity]!
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

  type TodoList {
    id: ID!
    todo: String
  }

  input TodoListInput {
    id: ID!
    todo: String
  }

  type Notes {
    id: ID!
    note: String
  }
  
  input NotesInput {
    id: ID!
    note: String
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
    register(firstName: String!, lastName: String!, email: String!, password: String!): User!
    createActivity(userId: ID!, date: String!, wakeUpTime: String, didYouEatHealthy: Boolean, didYouDoSport: Boolean, litresOfDrinkingWater: Float, todoList: [TodoListInput!], notes: [NotesInput!]): Activity!
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "users" array above.
const resolvers = {
  Mutation: {
    register: (parent, { firstName, lastName }) => {
      const newUser = { id: nanoid(), firstName, lastName }
      users.push(newUser)

      return newUser;
    },
    createActivity: (parent, { userId, date, wakeUpTime, didYouEatHealthy, didYouDoSport, litresOfDrinkingWater, todoList, notes }) => {
      const newActivity = { id: nanoid(), userId, date, wakeUpTime, didYouEatHealthy, didYouDoSport, litresOfDrinkingWater, todoList: todoList?.map(item => ({ id: nanoid, todo: item.todo })), notes: notes?.map(item => ({ id: nanoid, note: item.note })) }
      activities.push(newActivity);

      return newActivity;
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
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
}).catch(error => {
  console.error("Server start error:", error);
});
// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4000 },
// });