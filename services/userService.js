const User = require("../model/User");

exports.findAllUsers = async () => {
  return User.findAll();
};

// exports.findUserById = (req, res, next) => {

// };

// exports.findUserByEmail = (req, res, next) => {
//   res.status(200).json({ success: true, message: "getting user by email" });
// };
