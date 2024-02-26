const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const multer = require("multer")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  },
})
const upload = multer({ storage: storage })

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
    res.render("posts", { posts })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post("/posts", upload.array("images", 3), async (req, res) => {
  try {
    const { title, description } = req.body
    let imagePaths = []
    if (req.files) {
      imagePaths = req.files.map((file) => `/uploads/${file.filename}`)
    }

    const newPost = new Post({
      title,
      description,
      images: imagePaths,
    })

    await newPost.save()
    res.redirect("/")
  } catch (error) {
    res.status(500).send(error.message)
  }
})
module.exports = router
