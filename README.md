# Social Media App with Mern Stack & GraphQL | [Live](https://merng-social-orchan.netlify.app/)

MERNG Stack Social network app and website with cool features similar to other social media networks.

#### Live website last updated - 24/04/21

#### github repo last updated - 17/05/21

# Setup:

| Server Side        | Client Side |
| ------------------ | ----------- |
| ------------------ | `cd client` |
| `npm i`            | `npm i`     |
| `npm run serve`    | `npm start` |

#

# Necessary .env file variables at server side:

- MONGO_URI - mongoDB uri to connect with db.
- JWT_TOKEN - jwt token for auth.
- PORT - local port for server

##### Optional\*\* (only if you want to use Amazon S3 bucket service, if not use the local file save script instead of AWS [at graphql/resolvers/users.js])

- AWS_BUCKET_NAME
- AWS_BUCKET_REGION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

# 👨‍💻 Technologies Used:

### 👨‍🏫 Client Side👨‍🏫

- Frontend : JavaScript
- Frontend Frameworks and libraries:
  - React (react-router-dom)
  - Semantic UI
  - React Semantic UI
  - moment

### 🛠 Server Side 🛠

- Backend Node.js
- Backend Framework Express, graphql, Apollo
- Database MongoDB
- Server maintence Apollo Server, dotenv, cors, nodemon (development mode)
- Authentication and Security jsonwebtoken, bcryptjs

#

## Todo:

#

1. Add registered user count or list - Done.
2. Add user online/offline icon - Done.
3. Add currently online users - TBD.
4. Add user personal logo - Done.
