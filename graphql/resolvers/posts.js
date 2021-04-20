const { AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post does not exist");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    // Create Post
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      return post;
    },
    // Delete Post
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);

        if (user.username === post.username) {
          await post.delete();
          return `User:${post.username} , Post deleted`;
        } else {
          throw new AuthenticationError("Post is invalid");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
