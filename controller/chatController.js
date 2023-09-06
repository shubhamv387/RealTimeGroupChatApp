const Chat = require("../model/Chat");
const User = require("../model/User");
const { Op } = require("sequelize");
const { isMemberExistInThisGroup } = require("../services/groupServices");
const Group = require("../model/Group");
const { uploadeToS3 } = require("../services/S3Services");

// @desc    to get all chats of a particular group limit by 20
// @route   GET /api/chatbox/:groupId
// @access  Group Members
exports.getAllChats = async (req, res, next) => {
  const { groupId } = req.params;
  if (groupId == "null") {
    return res
      .status(404)
      .json({ success: false, message: "Open Your Group to Start Chat!" });
  }

  // Promise.All method implemented here to reduce time consumption
  const GroupWithThisId = Group.findByPk(req.params.groupId);

  const allChats = Chat.findAll({
    where: { groupId },
    attributes: { exclude: ["updatedAt"] },
    include: [
      {
        model: User,
        attributes: ["id", "fullName"],
      },
    ],
    order: [["id", "DESC"]],
    limit: 20,
  });

  const response = await Promise.all([GroupWithThisId, allChats]);

  if (!response[0])
    return res
      .status(404)
      .json({ success: false, message: "Group not Found!" });

  res.status(200).json({
    success: true,
    currentUserId: req.user.id,
    currentUserFullName: req.user.fullName,
    allChats: response[1],
    GroupWithThisId: response[0],
  });
};

// this one is not required now because of socket.io
// @desc    Get all chats wi id greater than last chat id
// @route   GET /api/chatbox//:chatId/:groupId
// @access  Group Members
exports.getLimitedChats = async (req, res, next) => {
  let { chatId, groupId } = req.params;

  if (chatId === "0") {
    await this.getAllChats(req, res, next);
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

// @desc    Send new message to group
// @route   GET /api/chatbox/chat/:groupId
// @access  Group Members
exports.sendMessage = async (req, res, next) => {
  const { chatText } = req.body;
  const { groupId } = req.params;

  const isMemberExist = await isMemberExistInThisGroup(req.user.id, groupId);

  if (!isMemberExist)
    return res.status(400).json({
      success: false,
      message: "you can't message here! create your group",
    });

  try {
    const createdChat = await req.user.createChat(
      { chat: chatText, groupId },
      {
        include: {
          model: User,
          attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        },
      }
    );
    res.status(200).json({
      success: true,
      currentUserId: req.user.id,
      currentUserFullName: req.user.fullName,
      createdChat,
    });
  } catch (error) {
    console.log(error);
  }
};

// @desc    Upload images to group
// @route   GET /api/chatbox/upload/:groupId
// @access  Group Members
exports.uploadFileData = async (req, res, next) => {
  try {
    const fileContent = Buffer.from(req.file.buffer, "binary");

    const fileName = `${req.user.id}/${req.file.originalname}`;

    const mimetype = req.file.mimetype;

    const fileUrl = await uploadeToS3(fileContent, fileName, mimetype);

    res.status(200).json({
      success: true,
      fileUrl,
      message: "Upload Successful",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Upload Failed", err: error });
  }
};
