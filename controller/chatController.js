const Chat = require("../model/Chat");
const User = require("../model/User");
exports.getAllChats = async (req, res, next) => {
  const allChats = await Chat.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "fullName"], // Specify the attributes you want from the User model
      },
    ],
  });
  res.status(200).json({ success: true, currentUserId: req.user.id, allChats });
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
