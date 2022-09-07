const { Router } = require("express");
const Conversation = require("../models/Conversation");
const conversationRouter = Router();
module.exports = conversationRouter;

// post conversation of a user
conversationRouter.post("/", async (req, res) => {
  // let isSaved = await Conversation.findOne({
  //   members: { $all: req.body.members },
  // });
  // if (isSaved) {
  // isSaved.name = req.body.name;
  // isSaved.friendname = req.body.friendname;
  //   return res.status(200).json(isSaved);
  // }
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get conversation of a user
conversationRouter.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get conv includes two userId

conversationRouter.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    if (conversation) {
      return res.status(200).json(conversation);
    }
    let newConversation = await Conversation.create({
      members: [req.params.firstUserId, req.params.secondUserId],
    });
    res.status(200).send({ conversation: newConversation });
  } catch (err) {
    res.status(500).json(err);
  }
});
