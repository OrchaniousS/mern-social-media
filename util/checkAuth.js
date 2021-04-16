const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const keyJWT = process.env.JWT_TOKEN;

module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, keyJWT);
        return user;
      } catch (err) {
        throw new AuthenticationError("Expierd Token");
      }
    }
    throw new Error("Authentication Token format must be 'Bearer [token]");
  }
  throw new Error("Authorization Header must be provided");
};
