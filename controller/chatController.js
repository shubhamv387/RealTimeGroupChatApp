const Chat = require("../model/Chat");
exports.getAllChats = async (req, res, next) => {
  //   const allChats = await userServices.findAllChats();
  res.status(200).json({ success: true });
};

exports.sendMessage = async (req, res, next) => {
  const { chatText } = req.body;
  try {
    const createdChat = await req.user.createChat({ chat: chatText });
    res.status(200).json({ success: true, createdChat });
  } catch (error) {
    console.log(error);
  }
};
