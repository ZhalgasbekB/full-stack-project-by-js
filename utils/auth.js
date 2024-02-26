const jwt = require("jsonwebtoken")
require("dotenv").config()

const verifyToken = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.redirect("/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    req.username = decoded.username
    next()
  } catch (error) {
    res.clearCookie("token")
    return res.redirect("/login")
  }
}

const redirectToHomeIfLoggedIn = (req, res, next) => {
  const token = req.cookies.token
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.clearCookie("token")
        return res.redirect("/login")
      } else {
        return res.redirect("/")
      }
    })
  } else {
    return next()
  }
}

const ifAdmin = (req, res, next) => {
  const token = req.cookies.token

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie("token")
      return res.redirect("/login")
    } else {
      if (decoded.isAdmin) {
        return next()
      } else {
        return res.status(403).send("Unauthorized Access - Admin Only")
      }
    }
  })
}

module.exports = { verifyToken, redirectToHomeIfLoggedIn, ifAdmin }
