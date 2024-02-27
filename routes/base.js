const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const multer = require("multer")

const fs = require("fs").promises // Импортируем асинхронные методы fs
const path = require("path")

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

    for (const post of posts) {
      const checks = post.images.map(async (image) => {
        const imagePath = path.join(__dirname, "../public", image)
        try {
          await fs.access(imagePath)
          return image
        } catch (error) {
          return null
        }
      })
      const results = await Promise.all(checks)
      post.images = results.filter((image) => image !== null)
    }

    res.render("posts", { posts })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post("/posts", upload.array("images", 3), async (req, res) => {
  try {
    const { title, description, author, category } = req.body
    let imagePaths = []
    if (req.files) {
      imagePaths = req.files.map((file) => `/uploads/${file.filename}`)
    }

    const isDraft = req.body.isDraft ? true : false

    const newPost = new Post({
      title,
      description,
      images: imagePaths,
      author,
      category,
      isDraft,
    })

    await newPost.save()
    res.redirect("/")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.get("/edit/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    res.render("updatePost", { post })
  } catch (error) {
    res.status(500).send(error.message)
  }
})
router.post("/update/:id", upload.array("images", 3), async (req, res) => {
  try {
    let imagePaths = []
    if (req.files) {
      imagePaths = req.files.map((file) => `/uploads/${file.filename}`)
    }
    const isDraft = req.body.isDraft ? true : false
    await Post.findByIdAndUpdate(req.params.id, {
      ...req.body,
      isDraft: isDraft,
      images: imagePaths,
    })
    res.redirect("/")
  } catch (error) {
    res.status(500).send(error.message)
  }
})

router.post("/delete/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id)
    res.redirect("/")
  } catch (error) {
    res.status(500).send(error.message)
  }
})
module.exports = router
