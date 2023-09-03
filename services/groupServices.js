const Group = require("../model/Group");
const GroupUser = require("../model/GroupUser");
const User = require("../model/User");

exports.isMemberExistInThisGroup = async (userId, groupId) => {
  const isUserExistInThisGroup = await GroupUser.findOne({
    where: { groupId, userId },
  });

  if (!isUserExistInThisGroup) return false;
  else return true;
};

exports.findGroupById = async (groupId) => {
  const group = await Group.findOne({
    where: { id: groupId },
    include: {
      model: User,
      attributes: ["id", "fullName"],
    },
  });

  if (!group) return { success: false, message: "Group not Found!" };
  else return { success: true, group };
};
