const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { validatePasswordChange } = require("../utils/validation")

const router = express.Router()

router.get("/", (req, res) => {
  res.render("profile")
})

router.post("/delete", async (req, res) => {
  try {
    const { userId } = jwt.decode(req.cookies.token)
    await User.findOneAndDelete({ _id: userId })
    res.clearCookie("token").redirect("/logout")
  } catch (error) {
    console.error(error)
    res.status(500).send("Error deleting user account")
  }
})

router.post("/pass", async (req, res) => {
  const { password, password2, password3 } = req.body
  const { userId } = jwt.decode(req.cookies.token)

  const validation = await validatePasswordChange(
    password,
    password2,
    password3,
    userId
  )
  if (!validation.success) {
    return res.render("profile", { errorMessage: validation.message })
  }

  try {
    const hashedPassword = await bcrypt.hash(password2, 10)
    const updateResult = await User.updateOne(
      { _id: userId },
      { password: hashedPassword }
    )

    if (updateResult.matchedCount === 0) {
      return res.status(404).send("User not found")
    }

    res.render("profile", { successMessage: "Password changed successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).send("Error changing password")
  }
})

module.exports = router
