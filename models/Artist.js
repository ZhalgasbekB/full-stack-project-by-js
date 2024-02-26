const mongoose = require("mongoose")

const artistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bands: [
    {
      artistId: Number,
      name: String,
      image: String,
      members: [String],
      creationDate: Number,
      firstAlbum: String,
    },
  ],
})

module.exports = mongoose.model("Artist", artistSchema)
