const Chat = require("../model/Chat");
const User = require("../model/User");
const { Op } = require("sequelize");
const { isMemberExistInThisGroup } = require("../services/groupServices");
const Group = require("../model/Group");
const { uploadeToS3 } = require("../services/S3Services");

exports.getAllChats = async (req, res, next) => {
  const { groupId } = req.params;
  if (groupId == "null") {
    return res
      .status(404)
      .json({ success: false, message: "Open Your Group to Start Chat!" });
  }

  const GroupWithThisId = await Group.findByPk(req.params.groupId);

  if (!GroupWithThisId)
    return res
      .status(404)
      .json({ success: false, message: "Group not Found!" });

  const isUserExist = await isMemberExistInThisGroup(req.user.id, groupId);

  if (!isUserExist)
    return res.status(400).json({
      success: false,
      message: "You are not a member of this group! Check your group",
    });

  const allChats = await Chat.findAll({
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

  res.status(200).json({
    success: true,
    currentUserId: req.user.id,
    currentUserFullName: req.user.fullName,
    allChats,
    GroupWithThisId,
  });
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

// @desc    Download user total expenses
// @route   GET /user/downloadexpensesreport
// @access  Premium Users Only
exports.uploadFileData = async (req, res, next) => {
  const { groupId } = req.params;
  try {
    const fileContent = Buffer.from(req.file.buffer, "binary");

    const fileName = `${req.user.id}/${groupId}/${req.file.originalname}`;

    const fileUrl = await uploadeToS3(fileContent, fileName);

    console.log(fileUrl);

    res.status(200).json({
      success: true,
      fileUrl,
      message: "Download Successful",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Download Failed", err: error });
  }
};
