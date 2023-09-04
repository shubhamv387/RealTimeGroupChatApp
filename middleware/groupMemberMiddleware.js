const GroupUser = require("../model/GroupUser");

exports.isGroupMember = async (req, res, next) => {
  const { groupId } = req.params;

  const group = await GroupUser.findOne({
    where: { groupId, userId: req.user.id },
  });
  if (!group)
    return res.status(400).json({
      success: false,
      message: "You are not a member or this group does not exist!",
    });
  // console.log(group);
  next();
};
