const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: String,
  password: String,  
  userId: mongoose.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false },
})
//   deletionDate: Date,

module.exports = mongoose.model("User", userSchema)
