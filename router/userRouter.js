const express = require("express");
const userController = require("../controller/userController");
const { authUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authUser, userController.getAllUsers);

router.post("/signup", userController.signUp);

router.post("/login", userController.logIn);

module.exports = router;
