// const mongoose = require('mongoose');

// const newsSchema = new mongoose.Schema({
//   sourceId: String,
//   sourceName: String,
//   author: String,
//   title: String,
//   description: String,
//   url: String,
//   urlToImage: String,
//   publishedAt: Date,
//   content: String,
// }, { timestamps: true }); // timestamps option adds createdAt and updatedAt fields

// const News = mongoose.model('News', newsSchema);

// module.exports = News;

const mongoose = require("mongoose")

const newsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    search: { type: String },  
    newsList: [
      {
        sourceId: String,
        sourceName: String,
        author: String,
        title: { type: String, required: true }, 
        description: String,
        url: { type: String, required: true },  
        urlToImage: String,  
        publishedAt: Date,
        content: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

newsSchema.index({ search: "text" })

const News = mongoose.model("News", newsSchema)

module.exports = News
