const express = require("express");
const groupController = require("../controller/groupController");
const { authUser } = require("../middleware/authMiddleware");
const { isGroupAdmin } = require("../middleware/groupAdminMiddleware");
const { isGroupMember } = require("../middleware/groupMemberMiddleware");

const router = express.Router();

router.post("/create-group", authUser, groupController.createGroup);

router.post("/add-users", authUser, groupController.addUsersToGroup);

router.get("/", authUser, groupController.getAllGroups);

router.get(
  "/:groupId",
  authUser,
  isGroupMember,
  groupController.getSingleGroup
);

router.delete(
  "/:groupId/:userId",
  authUser,
  isGroupMember,
  isGroupAdmin,
  groupController.deleteMemberFromGroup
);

router.delete(
  "/:groupId",
  authUser,
  isGroupMember,
  isGroupAdmin,
  groupController.deleteGroup
);

router.get(
  "/all-users/:groupId",
  authUser,
  isGroupMember,
  isGroupAdmin,
  groupController.getUsersNotInThisGroup
);

router.put(
  "/:groupId/:userId",
  authUser,
  isGroupMember,
  isGroupAdmin,
  groupController.makeNewAdminToTheGroup
);

module.exports = router;
