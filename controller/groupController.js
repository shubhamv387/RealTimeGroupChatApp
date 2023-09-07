const Group = require("../model/Group");
const User = require("../model/User");
const GroupUser = require("../model/GroupUser");
const { findGroupById } = require("../services/groupServices");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

// @desc    Get all Groups of a particular User
// @route   GET /api/group
// @access  Group Members
exports.getUserAllGroups = async (req, res, next) => {
  try {
    const { groups } = await User.findOne({
      where: { id: req.user.id },
      include: {
        model: Group,
        order: ["groupAdminId", "ASC"],
      },
    });
    res.status(200).json({
      success: true,
      groups,
      currentUserId: req.user.id,
      currentUserName: req.user.fullName,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc    create a new group
// @route   POST /api/group/create-group
// @access  Group Members
exports.createGroup = async (req, res, next) => {
  const { groupName } = req.body;
  try {
    const createdGroup = await req.user.createGroup({
      groupName,
      groupAdminId: req.user.id,
    });

    if (!createdGroup)
      return res
        .status(500)
        .json({ success: false, message: "internal server error" });

    res.status(201).json({ success: true, createdGroup });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc    Add new user/member to a particular group
// @route   POST /api/group/add-users
// @access  Group Admins
exports.addUsersToGroup = async (req, res, next) => {
  const { groupId, userIds } = req.body;

  try {
    // Using Promise.All
    const group = Group.findByPk(groupId);
    const users = User.findAll({
      where: {
        id: userIds,
      },
    });

    const response = await Promise.all([group, users]);

    const [groupData, usersData] = response;

    if (!groupData) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    if (usersData.length !== userIds.length) {
      return res
        .status(400)
        .json({ success: false, message: "One or more users not found" });
    }

    // Create entries in GroupUser for each user
    for (const user of usersData) {
      await GroupUser.create({
        userId: user.id,
        groupId: groupData.id,
        isGroupAdmin: false,
      });
    }

    res
      .status(201)
      .json({ success: true, message: "Users added to group successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc    Delete a member from a particular group
// @route   DELETE /api/group/:groupId/:userId
// @access  Group Admins
exports.deleteMemberFromGroup = async (req, res, next) => {
  const { groupId, userId } = req.params;
  const group = await GroupUser.findOne({ where: { groupId, userId } });
  if (!group)
    return res
      .status(400)
      .json({ success: false, message: "user is already not in this group!" });
  await group.destroy();
  res.status(200).json({ success: true, message: "deleting the user!" });
};

// @desc    Delete a particular group
// @route   DELETE /api/group/:groupId
// @access  Group Main Admin
exports.deleteGroup = async (req, res, next) => {
  const { groupId } = req.params;
  const group = await Group.findOne({ where: { id: groupId } });
  if (!group)
    return res
      .status(400)
      .json({ success: false, message: "Group does not exists!" });

  await group.destroy();
  res.status(200).json({ success: true, message: "group deleted!" });
};

// @desc    to get single group
// @route   GET /api/group/:groupId
// @access  Group Members
exports.getSingleGroup = async (req, res, next) => {
  const groupData = await findGroupById(req.params.groupId);
  if (!groupData.success) return res.status(404).json(groupData);

  res.status(200).json(groupData);
};

// @desc    get all user not present in a particular group
// @route   GET /api/group/all-users/:groupId
// @access  Group Admins
exports.getUsersNotInThisGroup = async (req, res, next) => {
  const { groupId } = req.params;

  try {
    const users = await User.findAll({
      where: {
        id: {
          [Op.notIn]: [
            sequelize.literal(
              `SELECT userId FROM groupUsers WHERE groupId = ${groupId}`
            ),
          ],
        },
      },
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc    Assign new Admin to a particular group
// @route   GET /api/group/:groupId/:userId
// @access  Group Admins
exports.makeNewAdminToTheGroup = async (req, res, next) => {
  const { groupId, userId } = req.params;
  await GroupUser.update(req.body, {
    where: { groupId, userId },
  });
  if (req.body.isGroupAdmin)
    res.status(200).json({
      success: true,
      message: "making user to admin of this group",
    });
  else
    res.status(200).json({
      success: true,
      message: "removing admin access from this user",
    });
};
