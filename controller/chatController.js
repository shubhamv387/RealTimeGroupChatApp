const Chat = require("../model/Chat");
const User = require("../model/User");
const { Op } = require("sequelize");
exports.getAllChats = async (req, res, next) => {
  const allChats = await Chat.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "fullName"], // Specify the attributes you want from the User model
      },
    ],
    order: [["id", "DESC"]],
    limit: 20,
  });
  res.status(200).json({ success: true, currentUserId: req.user.id, allChats });
};

exports.getLimitedChats = async (req, res, next) => {
  let { chatId } = req.params;

  if (chatId === "0") {
    this.getAllChats(req, res, next);
  } else {
    const allChats = await Chat.findAll({
      where: { id: { [Op.gt]: parseInt(chatId) } },
      include: [
        {
          model: User,
          attributes: ["id", "fullName"],
        },
      ],
    });
    res
      .status(200)
      .json({ success: true, currentUserId: req.user.id, allChats });
  }
};

exports.sendMessage = async (req, res, next) => {
  const { chatText } = req.body;
  try {
    const createdChat = await req.user.createChat({ chat: chatText });
    res
      .status(200)
      .json({ success: true, currentUserId: req.user.id, createdChat });
  } catch (error) {
    console.log(error);
  }
};
