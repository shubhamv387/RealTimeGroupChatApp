const GroupUser = require("../model/GroupUser");

exports.isMemberExistInThisGroup = async (userId, groupId) => {
  const isUserExistInThisGroup = await GroupUser.findOne({
    where: { groupId, userId },
  });

  if (!isUserExistInThisGroup) return false;
  else return true;
};
