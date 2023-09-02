const Group = require("../model/Group");

exports.isGroupAdmin = async (req, res, next) => {
  const { groupId } = req.params;

  const group = await Group.findOne({ where: { id: groupId } });
  if (!group)
    return res
      .status(400)
      .json({ success: false, message: "Group does not exists!" });

  if (group.groupAdminId == req.user.id) next();
  else
    return res
      .status(400)
      .json({ success: false, message: "You're not an admin of this group" });
};
