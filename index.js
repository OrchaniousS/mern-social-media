require('dotenv').config({ path: '.env' });
const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const Post = require('./models/Post')
const User = require('./models/User')

const typeDefs = gql`
    type Post{
        id:ID!
        body:String!
        createdAt:String!
        username:String!
    }
    type Query{
        sayHi: String!,
        getPosts:[Post]
    }
`

const resolvers = {
    Query:{
        sayHi: () => 'Hellow',
        async getPosts(){
            try{
                const posts = await Post.find();
                return posts;
            } catch(err){
                throw new Error(err);
            }
        }
    }
}

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