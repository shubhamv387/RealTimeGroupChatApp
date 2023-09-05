const express = require("express");
const chatController = require("../controller/chatController");
const { authUser } = require("../middleware/authMiddleware");
const { isGroupMember } = require("../middleware/groupMemberMiddleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/:groupId", authUser, isGroupMember, chatController.getAllChats);

router.get(
  "/:chatId/:groupId",
  authUser,
  isGroupMember,
  chatController.getLimitedChats
);

router.post(
  "/chat/:groupId",
  authUser,
  isGroupMember,
  chatController.sendMessage
);

router.post(
  "/upload/:groupId",
  authUser,
  isGroupMember,
  upload.single("file"),
  chatController.uploadFileData
);

module.exports = router;
