const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
    required: true,
  },
  category: { type: String, required: true },
  isDraft: { type: Boolean, default: true },
})

const Post = mongoose.model("Post", postSchema)

module.exports = Post
