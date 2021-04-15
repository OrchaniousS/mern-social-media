require('dotenv').config({ path: '.env' });
const { ApolloServer } = require('apollo-server');
// const gql = require('graphql-tag');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')

const server = new ApolloServer({
    typeDefs,
    resolvers
})

mongoose
.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log('connected to database :)')
    return server.listen({port:5000})
})
.then((res)=>{
    console.log(`server running at ${res.url}`)
})