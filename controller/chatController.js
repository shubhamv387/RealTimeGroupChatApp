const Chat = require("../model/Chat");
const User = require("../model/User");
const { Op } = require("sequelize");
const { isMemberExistInThisGroup } = require("../services/groupServices");
const Group = require("../model/Group");

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
    const createdChat = await req.user.createChat({ chat: chatText, groupId });
    res
      .status(200)
      .json({ success: true, currentUserId: req.user.id, createdChat });
  } catch (error) {
    console.log(error);
  }
};
