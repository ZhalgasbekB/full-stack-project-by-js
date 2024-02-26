const express = require("express")
const axios = require("axios")
const News = require("../models/News")
const jwt = require("jsonwebtoken")
const router = express.Router()

router.get("/", (req, res) => {
  res.render("news", {
    newsData: [],
    searchQuery: "",
  })
})
router.post("/", async (req, res) => {
  const searchQuery = req.body.search

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      searchQuery
    )}&from=2024-01-26&sortBy=publishedAt&apiKey=d9e7413d5aa94275a46cd533de232fb9`
    const response = await axios.get(url)

    const decodedToken = jwt.decode(req.cookies.token)
    const userId = decodedToken.userId

    let uNews = await News.findOne({ userId })

    if (!uNews) {
      const search = req.body.search
      uNews = new News({ userId, search, newsList: [] })
    }

    const articles = response.data.articles.map((article) => ({
      sourceId: article.source.id,
      sourceName: article.source.name,
      author: article.author,
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: new Date(article.publishedAt),
      content: article.content,
    }))

    for (const articleData of articles) {
      uNews.newsList.push(articleData)
    }

    uNews.newsList = uNews.newsList.slice(-30)
    await uNews.save()

    res.render("news", {
      newsData: uNews.newsList,
    })
  } catch (error) {
    console.error("Error fetching or saving news:", error)
    res.status(500).render("news", {
      newsData: [],
      errorMessage: "Error fetching or saving news",
      searchQuery: searchQuery,
    })
  }
})
module.exports = router
