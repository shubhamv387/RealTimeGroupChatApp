const express = require("express");
const groupController = require("../controller/groupController");
const { authUser } = require("../middleware/authMiddleware");
const { isGroupAdmin } = require("../middleware/GroupAdminMiddleware");

const router = express.Router();

router.post("/create-group", authUser, groupController.createGroup);

router.post("/add-users", authUser, groupController.addUsersToGroup);

router.get("/", authUser, groupController.getAllGroups);

router.get("/:groupId", authUser, groupController.getSingleGroup);

router.delete(
  "/:groupId/:userId",
  authUser,
  isGroupAdmin,
  groupController.deleteMemberFromGroup
);

router.delete("/:groupId", authUser, isGroupAdmin, groupController.deleteGroup);

router.get(
  "/all-users/:groupId",
  authUser,
  isGroupAdmin,
  groupController.getUsersNotInThisGroup
);

module.exports = router;
