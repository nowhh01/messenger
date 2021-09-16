const Sequelize = require("sequelize");
const db = require("../db");
const { Op } = require("sequelize");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  isRead: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  }
});

Message.findAllUnreadFromOther = async function (userId, conversationId) {
  const messages = await Message.findAll({
    where: {
      conversationId: conversationId,
      senderId: {
        [Op.not]: userId
      },
      isRead: {
        [Op.not]: true
      }
    }
  });

  return messages;
};

module.exports = Message;
