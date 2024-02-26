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
    const { title, description, author, category } = req.body
    let imagePaths = []
    if (req.files) {
      imagePaths = req.files.map((file) => `/uploads/${file.filename}`)
    }

    const isDraft = req.body.isDraft ? true : false;

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
module.exports = router
// const express = require("express")
// const router = express.Router()
// const Post = require("../models/Post")
// const multer = require("multer")
// // const jwt = require("jsonwebtoken")

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads/")
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname)
//   },
// })
// const upload = multer({ storage: storage })

// router.get("/", async (req, res) => {
//   try {
//     // const decodedToken = jwt.decode(req.cookies.token)
//     // const userId = decodedToken.userId
//     // let uPost = await Post.findOne({ userId })
//     // const posts = uPost.posts

//     // if (!uPost) {
//     //     uPost = new Post({ userId, posts: [] })

//     // }
//     const posts = await Post.findOne()
//     res.render("posts", { posts })
//     // res.render("posts", { posts: uPost.posts })
//   } catch (error) {
//     res.status(500).send(error)
//   }
// })

// router.post("/posts", upload.array("images", 3), async (req, res) => {
//   try {
//     const { title, description } = req.body
//     let imagePaths = []
//     if (req.files) {
//       imagePaths = req.files.map((file) => `/uploads/${file.filename}`)
//     }

//     //
//     // const decodedToken = jwt.decode(req.cookies.token)
//     // const userId = decodedToken.userId
//     // let uPost = await Post.findOne({ userId })

//     // if (!uPost) {
//     //   uPost = new Post({ userId, posts: [] })
//     // }

//     //
//     const newPost = new Post({
//       title,
//       description,
//       images: imagePaths,
//     })
//     //
//     // uPost.posts.push(newPost)
//     //

//     await newPost.save()
//     res.redirect("/")
//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// })
// module.exports = router
