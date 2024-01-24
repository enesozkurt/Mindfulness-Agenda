const { createServer } = require('node:http')
const { createSchema, createYoga } = require('graphql-yoga')

const resolvers = require('./graphql/resolvers/index')
const typeDefs = require('./graphql/type-defs')

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
  resolvers
  })
})

const server = createServer(yoga)
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})