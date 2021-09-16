const router = require("express").Router();
const { User } = require("../../db/models");
const { Op } = require("sequelize");
const socketIo = require("../../bin/www");

// find users by username
router.get("/:username", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { username } = req.params;

    const users = await User.findAll({
      where: {
        username: {
          [Op.substring]: username
        },
        id: {
          [Op.not]: req.user.id
        }
      }
    });

    // add online status to each user that is online
    const rooms = socketIo.io.of("/").adapter.rooms;
    for (let i = 0; i < users.length; i++) {
      const userJSON = users[i].toJSON();

      if (rooms.get(userJSON.id)) {
        userJSON.online = true;
      }

      users[i] = userJSON;
    }
    res.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
