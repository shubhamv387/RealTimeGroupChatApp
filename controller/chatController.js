const Chat = require("../model/Chat");
const User = require("../model/User");
const { Op } = require("sequelize");

exports.getAllChats = async (req, res, next) => {
  if (req.params.groupId == "null") {
    return res
      .status(404)
      .json({ success: false, message: "Group not Found!" });
  } else {
    const allChats = await Chat.findAll({
      where: { groupId: req.params.groupId },
      include: [
        {
          model: User,
          attributes: ["id", "fullName"], // Specify the attributes you want from the User model
        },
      ],
      order: [["id", "DESC"]],
      limit: 20,
    });
    res.status(200).json({
      success: true,
      currentUserId: req.user.id,
      currentUserFullName: req.user.fullName,
      allChats,
    });
  }
};

exports.getLimitedChats = async (req, res, next) => {
  let { chatId, groupId } = req.params;

  if (chatId === "0") {
    this.getAllChats(req, res, next);
  } else {
    const allChats = await Chat.findAll({
      where: { groupId, id: { [Op.gt]: parseInt(chatId) } },
      include: [
        {
          model: User,
          attributes: ["id", "fullName"],
        },
      ],
    });
    res.status(200).json({
      success: true,
      currentUserId: req.user.id,
      currentUserFullName: req.user.fullName,
      allChats,
    });
  }
};

exports.sendMessage = async (req, res, next) => {
  const { chatText } = req.body;
  const { groupId } = req.params;
  try {
    const createdChat = await req.user.createChat({ chat: chatText, groupId });
    res
      .status(200)
      .json({ success: true, currentUserId: req.user.id, createdChat });
  } catch (error) {
    console.log(error);
  }
};
