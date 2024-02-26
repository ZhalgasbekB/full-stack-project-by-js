const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const {
  verifyToken,
  redirectToHomeIfLoggedIn,
  ifAdmin,
} = require("./utils/auth")

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas")
  })
  .catch((err) => console.error(err))

app.set("view engine", "ejs") // Set EJS as the templating engine
// app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static("public"))

app.use(async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
    return res.status(200).json({})
  }

  const token = req.cookies.token
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
        isAdmin: decoded.isAdmin,
      }
      res.locals.loggedIn = true
      res.locals.username = decoded.username
      res.locals.admin = decoded.isAdmin
    } catch (error) {
      res.clearCookie("token")
      res.locals.loggedIn = false
      res.locals.admin = false
    }
  } else {
    res.locals.loggedIn = false
    res.locals.admin = false
  }
  next()
})

app.use("/admin", verifyToken, ifAdmin, require("./routes/adminP"))
app.use("/register", redirectToHomeIfLoggedIn, require("./routes/register"))
app.use("/login", redirectToHomeIfLoggedIn, require("./routes/login"))
app.use("/logout", verifyToken, require("./routes/logout"))
app.use("/", verifyToken, require("./routes/base"))
app.use("/news", verifyToken, require("./routes/news"))
app.use("/rickAndMorty", verifyToken, require("./routes/rickAndMorty"))
app.use("/crypto", verifyToken, require("./routes/crypto"))
app.use("/profile", verifyToken, require("./routes/profile"))
app.use("/groupie", verifyToken, require("./routes/groupie"))

app.use((req, res, next) => {
  res.status(404).send("<center><h1>404 Not Found</h1></center>")
  next()
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
