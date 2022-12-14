const { Router } = require("express");
const User = require("../models/User");
const authRouter = Router();
module.exports = authRouter;

// Register User
authRouter.post("/register", async (req, res) => {
  try {
    let user = new User(req.body);
    await user.save();
    res.send("user created");
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login User
authRouter.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    !user && res.status(404).send("User not found");
    if (req.body.password !== user.password) {
      return res.status(400).send({ message: "Wrong Password" });
    }
    user && res.status(200).send({ message: "Logged in successfully", user });
  } catch (error) {
    res.status(500).json(error);
  }
});
