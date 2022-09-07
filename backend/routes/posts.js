const { Router } = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

const postRouter = Router();

// create post
postRouter.post("/", async (req, res) => {
  let newPost = new Post(req.body);
  try {
    let saved = await newPost.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update post
postRouter.put("/:id", async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).send("post updated successfully.");
    } else {
      res.status(403).send("you can update your post only.");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete post
postRouter.delete("/:id", async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).send("post has been deleted.");
    } else {
      res.status(403).send("you can delete your post only.");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// like / dislike a post
postRouter.put("/:id/like", async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked.");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked.");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// get a post
postRouter.get("/:id", async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
  //   62ac4f9afafda043ef719266
});

// timeline posts
postRouter.get("/timeline/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    let userPosts = await Post.find({ userId: user._id });
    let friendsPosts = await Promise.all(
      user.followers.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).send({ posts: userPosts.concat(...friendsPosts) });
  } catch (error) {
    res.status(500).json(error);
  }
});

postRouter.get("/profile/:username", async (req, res) => {
  try {
    let user = await User.findOne({ username: req.params.username });
    let posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

postRouter.post("/comment", async (req, res) => {
  try {
    let comment = await Comment.create(req.body);
    let user = await User.findOne({ _id: comment.userId }).select(
      "username profilePicture"
    );
    res.status(200).json({ comment, user });
  } catch (error) {
    res.status(500).json(error);
  }
});

postRouter.get("/comments/:postId", async (req, res) => {
  try {
    let comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    let users = await Promise.all(
      comments.map((comment) => {
        return User.findOne({ _id: comment.userId }).select(
          "username profilePicture"
        );
      })
    );
    for (let i = 0; i < comments.length; i++) {
      comments[i] = { comment: comments[i], user: users[i] };
    }
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = postRouter;
