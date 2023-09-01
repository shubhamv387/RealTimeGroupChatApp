const Group = require("../model/Group");
const User = require("../model/User");
const GroupUser = require("../model/GroupUser");

exports.createGroup = async (req, res, next) => {
  const { groupName } = req.body;
  try {
    const createdGroup = await req.user.createGroup({
      groupName,
      groupAdminId: req.user.id,
    });

    res.status(201).json({ success: true, createdGroup });
  } catch (error) {
    console.log(error);
  }
};

exports.addUsersToGroup = async (req, res, next) => {
  const { groupId, userIds } = req.body;

  try {
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    console.log(group);
    const users = await User.findAll({
      where: {
        id: userIds,
      },
    });

    console.log(users);

    if (users.length !== userIds.length) {
      return res
        .status(400)
        .json({ success: false, message: "One or more users not found" });
    }

    // Create entries in GroupUser for each user
    for (const user of users) {
      await GroupUser.create({
        userId: user.id,
        groupId: group.id,
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

exports.getAllGroups = async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      include: {
        model: User,
        attributes: { exclude: ["password"] },
      },
    });

    res.status(201).json({ success: true, groups });
  } catch (error) {
    console.log(error);
  }
};