const express = require("express")
const UserModel = require("./schema")
const usersRouter = express.Router()

usersRouter.get("/me", async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})





module.exports = usersRouter
