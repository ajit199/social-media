const { Router } = require("express");
const Message = require("../models/Message");
const MessageRouter = Router(); 
module.exports = MessageRouter;

// add a new message
MessageRouter.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

//  get all messages of a conversation
MessageRouter.get("/:conversationId", async (req, res) => {
  try {
    let messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});
