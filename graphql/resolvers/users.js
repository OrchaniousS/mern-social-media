require("dotenv").config({ path: ".env" });
const { UserInputError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
// const fs = require("fs");
const AWS = require("aws-sdk");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const FILE_PERMISSION = "public-read";

const s3 = new AWS.S3({
  bucketRegion,
  accessKeyId,
  secretAccessKey,
  apiVersion: "2006-03-01",
  signatureVersion: "v4",
  s3DisableBodySigning: true,
});

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

const User = require("../../models/User");
const Post = require("../../models/Post");

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
        confirmPassword,
        logo
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

      // User Logo Upload
      const { createReadStream, filename } = await logo;
      const fileStream = createReadStream();
      const { ext } = path.parse(filename);
      const randomLogoName = generateRandomString(12) + ext;

      // [Hard-drive/Locally Image Save]
      // const pathname = path.join(
      //   process.cwd(),
      //   `/public/images/${randomLogoName}`
      // );
      // stream.pipe(fs.createWriteStream(pathname));

      // [Amazon S3 Bucket Image Save]
      const uploadParams = {
        Bucket: bucketName,
        Key: randomLogoName,
        Body: fileStream,
        ACL: FILE_PERMISSION,
      };

      const result = await s3.upload(uploadParams).promise();

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
        status: "online",
        logo: `https://${bucketName}.s3.eu-central-1.amazonaws.com/${randomLogoName}`,
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        result,
        ...res._doc,
        id: res._id,
        token,
      };
    },

    // Edit existing user
    async editUser(
      _,
      { id, username, email, password, confirmPassword, logo }
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword,
        logo
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      let result;

      const user = await User.find({ username });
      const users = await User.find({});

      console.log({ logo });

      if (!logo || logo === "" || logo === "undefined") {
        // logo = "https://react.semantic-ui.com/images/avatar/large/molly.png";
        logo = user.logo;
      } else {
        const { createReadStream, filename } = await logo;
        const fileStream = createReadStream();
        const { ext } = path.parse(filename);
        const randomLogoName = generateRandomString(12) + ext;

        const uploadParams = {
          Bucket: bucketName,
          Key: randomLogoName,
          Body: fileStream,
          ACL: FILE_PERMISSION,
        };

        result = await s3.upload(uploadParams).promise();
        logo = `https://${bucketName}.s3.eu-central-1.amazonaws.com/${randomLogoName}`;
      }

      if (users.some((user) => user.username === username)) {
        if (username !== user.username) {
          username = await username;
        } else {
          username = await user.username;

          throw new UserInputError("username is taken", {
            errors: {
              username: "This username is taken",
            },
          });
        }
      } else {
        username = await username;
      }

      // Hash password
      if (password === "undefined" || password === "") {
        password = await user.password;
      } else {
        const match = await bcrypt.compare(password, user.password || "");
        if (match) {
          password = user.password;
          throw new UserInputError("Can`t use the same password", {
            errors: {
              password: "Can`t use the same password",
            },
          });
        } else {
          password = await bcrypt.hash(password, 12);
        }
      }

      if (email !== user.email) {
        email = await email;
      } else {
        email = await user.email;
        throw new UserInputError("Can`t use the same email", {
          errors: {
            email: "This email is taken",
          },
        });
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: ObjectId(id) },
        {
          $set: {
            username: username,
            password: password,
            email: email,
            logo: logo,
          },
        }
      );

      // if (updatedUser) {
      //   throw new UserInputError("username is taken", {
      //     errors: {
      //       username: "This username is taken",
      //     },
      //   });
      // }

      const editedUser = await updatedUser.save();

      return { result, editedUser };
    },

    async deleteUser(_, { username }) {
      const user = await User.findOneAndDelete(
        { username: username },
        function (err, docs) {
          if (err || !docs) return console.log(err);
          else {
            console.log("Deleted User : ", docs);
          }
        }
      );

      const post = await Post.deleteMany(
        { username: username },
        function (err, docs) {
          if (err || !docs) return console.log(err);
          else {
            console.log("Deleted Post : ", docs);
          }
        }
      );

      // const deletedUser = await user.save();
      // const deletedPost = await post.save();

      return {
        user,
        post,
      };
    },
  },
};
