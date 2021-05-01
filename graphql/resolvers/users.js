require("dotenv").config({ path: ".env" });
const { UserInputError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

const User = require("../../models/User");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      status: user.status,
    },
    process.env.JWT_TOKEN,
    { expiresIn: "1h" }
  );
};

function generateRandomString(len) {
  var randomString = "";
  var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charsLength = chars.length;
  for (var i = 0; i < len; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return randomString;
}

module.exports = {
  Query: {
    async getUsers() {
      try {
        const users = await User.find();
        return users;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getUser(_, { userId }) {
      const user = await User.findById({ userId });

      try {
        if (user) {
          return user;
        } else throw new Error("User does not exist");
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    // User Login
    async login(_, { username, password, status }) {
      const { errors, valid } = validateLoginInput(username, password);

      const user = await User.findOne({ username });

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const active = "online";

      const userUpdate = await User.findOneAndUpdate(
        { username },
        { $set: { status: status && active } }
      );
      const loggedInUser = await userUpdate.save();

      const token = generateToken(user);

      return {
        loggedInUser,
        ...user._doc,
        id: user._id,
        token,
        user,
      };
    },

    // User Logout
    async logoutUser(_, { username, status }) {
      const offline = "offline";

      const user = await User.findOneAndUpdate(
        { username },
        { $set: { status: status && offline } }
      );

      const loggedOffUser = await user.save();
      return loggedOffUser;
    },

    // User Register
    async register(_, { username, email, password, confirmPassword, logo }) {
      // Validation
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // Hash password
      password = await bcrypt.hash(password, 12);

      // Check if user exists in db
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      // User Logo

      const { createReadStream, filename } = await logo;
      const stream = createReadStream();

      const { ext } = path.parse(filename);
      const randomLogoName = generateRandomString(12) + ext;

      const pathname = path.join(
        process.cwd(),
        `/public/images/${randomLogoName}`
      );
      await stream.pipe(fs.createWriteStream(pathname));

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
        status: "online",
        logo: logo
          ? `http://localhost:5000/images/${randomLogoName}`
          : "https://react.semantic-ui.com/images/avatar/large/molly.png",
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    // Edit existing user
    async editUser(_, { username, password }) {
      const user = await User.findOneAndUpdate(
        { username },
        {
          $set: {
            username,
            password: await bcrypt.hash(password, 12),
          },
        }
      );

      if (user) {
        throw new UserInputError("username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      const editedUser = await user.save();

      return editedUser;
    },
  },
};
