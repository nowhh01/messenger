const router = require("express").Router();
const socketIo = require("../../bin/www");
const { Conversation, Message } = require("../../db/models");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId
      });

      if (socketIo.io.of("/").adapter.rooms.get(sender.id)) {
        sender.online = true;
      }
    } else if (conversation.id !== conversationId) {
      return res.sendStatus(403);
    }

    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id
    });

    const newMessage = {
      message,
      sender
    };

    // notify recipient of new message
    socketIo.io.to(recipientId).emit("new-message", newMessage);

    res.json(newMessage);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
