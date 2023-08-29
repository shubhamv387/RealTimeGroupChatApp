const express = require("express");
const chatController = require("../controller/chatController");
const { authUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authUser, chatController.getAllChats);

router.post("/chat", authUser, chatController.sendMessage);

module.exports = router;
