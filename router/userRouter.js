const express = require("express");
const userController = require("../controller/userController");

const router = express.Router();

router.get("/", userController.getAllUsers);

router.post("/signup", userController.signUp);

router.post("/login", userController.logIn);

module.exports = router;
