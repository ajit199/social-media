const { Router } = require("express");
const User = require("../models/User");

const userRouter = Router();

// update a user
userRouter.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      let updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).send("User updated successfully.");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).send("You can update only your data.");
  }
});
// delete a user
userRouter.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      let deleteUser = await User.deleteOne({
        _id: req.params.id,
      });
      return res.status(203).json(deleteUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(400).send("You can only delete your own account.");
  }
});
// get a user
userRouter.get("/", async (req, res) => {
  let userId = req.query.userId;
  let username = req.query.username;
  try {
    let user = userId
      ? await User.findById(userId)
      : await User.findOne({ username });
    let { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(404).json(error);
  }
});

// get user friends
userRouter.get("/friends/:userId", async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    if (user) {
      let friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId).select("profilePicture username");
        })
      );
      res.status(200).json(friends);
    } else {
      return res.status(404).send("User not found.");
    }
  } catch (error) {
    res.status(400).json("error");
  }
});

// follow a user
userRouter.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      let currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).send("You followed user successfully.");
      } else {
        res.status(403).send("You already followed this user");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).send("You can't follow yourself.");
  }
});
// unfollow a user
userRouter.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      let currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).send("You unfollowed this user.");
      } else {
        res.status(403).send("You don't follow this user");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(403).send("You can't unfollow yourself.");
  }
});

module.exports = userRouter;
