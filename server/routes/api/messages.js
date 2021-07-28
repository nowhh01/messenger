const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
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
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/unread-to-read-from-other", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    const userId = req.user.id;
    const { conversationId } = req.body;

    // check if it is one of user's conversations
    const conversation = await Conversation.findConversationById(
      conversationId
    );
    if (!conversation) {
      return res.sendStatus(403);
    }

    const messages = await Message.findAllUnreadFromOther(
      userId,
      conversationId
    );
    const ids = messages.map((m) => m.id);

    const countAndMessages = await Message.update(
      { isRead: true },
      { where: { id: ids }, returning: true }
    );

    res.json({ messages: countAndMessages[1] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
