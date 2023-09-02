const express = require("express");
const groupController = require("../controller/groupController");
const { authUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-group", authUser, groupController.createGroup);

router.post("/add-users", authUser, groupController.addUsersToGroup);

router.get("/", authUser, groupController.getAllGroups);

router.delete(
  "/:groupId/:userId",
  authUser,
  groupController.deleteMemberFromGroup
);

module.exports = router;
