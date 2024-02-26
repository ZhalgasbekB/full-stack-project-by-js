const mongoose = require("mongoose")

const characterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  characterList: [
    {
      characterId: { type: Number, required: true },  
      name: { type: String, required: true },
      status: String,
      species: String,
      gender: String,
      origin: {
        name: String,
        url: String,
      },
      location: {
        name: String,
        url: String,
      },
      image: { type: String, required: true },
      url: String,
      created: Date,
      episode: [String],
    },
  ],
})

const Character = mongoose.model("Character", characterSchema)

module.exports = Character
