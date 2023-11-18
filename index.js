import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const activities = 
  {
    id: "1",
    userId: "1",
    date: '19.11.2023',
    wakeUpTime: '10:00',
    didYouEatHealthy: true,
    didYouDoSport: true,
    litresOfDrinkingWater: '2',
    todoList: [],
    notes: []
  }

const users = [
  {
    id: "1",
    firstName: 'Enes',
    lastName: 'Özkurt',
    activities
  }
];

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
    activities: Activity!
  }

  type Activity {
    id: ID!
    userId: ID!
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

  type Notes {
    id: ID!
    note: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "users" query returns an array of zero or more Users (defined above).
  type Query {
    users: [User!]!
    activities: Activity!
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "users" array above.
const resolvers = {
  Query: {
    users: () => users,
    activities: () => activities
  },
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
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);