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
