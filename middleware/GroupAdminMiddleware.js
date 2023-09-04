const GroupUser = require("../model/GroupUser");

exports.isGroupAdmin = async (req, res, next) => {
  const { groupId } = req.params;

  const group = await GroupUser.findOne({
    where: { groupId, userId: req.user.id },
  });
  if (!group)
    return res
      .status(404)
      .json({ success: false, message: "Group does not exists!" });

  if (!group.isGroupAdmin)
    return res
      .status(400)
      .json({ success: false, message: "You're not an admin of this group" });
  next();
};
