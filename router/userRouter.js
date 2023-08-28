const express = require("express");
const { getAllUsers } = require("../controller/userController.js");

const router = express.Router();

router.use("/", getAllUsers);

module.exports = router;
