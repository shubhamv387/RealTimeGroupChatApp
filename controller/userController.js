const userServices = require("../services/userService");

const getAllUsers = (req, res, next) => {
  userServices.findAllUsers();
  res.status(200).json({ success: true, message: "getting all users" });
};

module.exports = { getAllUsers };
