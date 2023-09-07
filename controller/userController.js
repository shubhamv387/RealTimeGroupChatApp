const userServices = require("../services/userService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");

// @desc    Get all User
// @route   GET /api/users
// @access  Private
exports.getAllUsers = async (req, res, next) => {
  const allUsers = await userServices.findAllUsers();
  res.status(200).json({ success: true, allUsers: allUsers });
};

// @desc    Signup into this Web App
// @route   POST /api/users/signup
// @access  Public
exports.signUp = async (req, res, next) => {
  const user = req.body;
  const t = await sequelize.transaction();

  try {
    const userFromEmail = await userServices.findUserByEmail(user.email);

    if (userFromEmail.success) {
      return res
        .status(400)
        .json({ success: false, message: "email already exists!" });
    }

    const {
      success,
      createdUser: { id, fullName, email, phone },
    } = await userServices.createNewUser(user, t);

    if (!success) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong" });
    }

    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    await t.commit();
    return res.status(201).json({
      success: true,
      createdUser: { id, fullName, email, phone },
      token,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
};

// @desc    Login into this Web App
// @route   POST /api/users/signup
// @access  Public
exports.logIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { success, user } = await userServices.findUserByEmail(email);
    if (!success)
      return res
        .status(401)
        .json({ success: false, message: "User not found!" });

    const confirmPass = bcrypt.compareSync(password, user.password);

    if (!confirmPass)
      return res
        .status(401)
        .json({ success: false, message: "User not authorized" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged in successfully!", token });
  } catch (error) {
    console.log(error);
  }
};
