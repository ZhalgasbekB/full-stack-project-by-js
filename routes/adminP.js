const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const { validateRegistration } = require("../utils/validation")
const jwt = require("jsonwebtoken")

router.get("/", async (req, res) => {
  try {
    const users = await User.find()
    res.render("admin", { users })
  } catch (error) {
    console.error(error)
    res.status(500).json({ errorMessage: "Error fetching users" })
  }
})

router.post("/create", async (req, res) => {
  const { username, password, password2 } = req.body
  const users = await User.find()
  console.log(req.body)

  const validationResult = await validateRegistration(
    username,
    password,
    password2
  )
  if (!validationResult.success) {
    return res.render("admin", {
      users,
      errorMessage: validationResult.message,
    })
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ username, password: hashedPassword })

  try {
    await user.save()
    return res.redirect("/admin")
  } catch (error) {
    console.error(error)
    return res.render("admin", { users, errorMessage: error.message })
  }
})

router.post("/delete/:id", async (req, res) => {
  const { id } = req.params
  const users = await User.find()
  try {
    await User.findByIdAndDelete(id)
    return res.redirect("/admin")
  } catch (error) {
    console.error(error)
    return res.status(500).json({ errorMessage: "Error deleting user" })
  }
})

router.post("/update/:id", async (req, res) => {
  const { id } = req.params
  const { newUsername, password, isAdmin } = req.body

  try {
    let updateData = {}

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateData.password = hashedPassword
    }

    if (newUsername) {
      updateData.username = newUsername
    }

    updateData.isAdmin = isAdmin === "on"

    await User.findByIdAndUpdate(id, updateData)
    return res.redirect("/admin")
  } catch (error) {
    console.error(error)
    return res.status(500).json({ errorMessage: "Error updating user" })
  }
})

module.exports = router
