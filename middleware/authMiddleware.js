const jwt = require("jsonwebtoken");
const { findUserById } = require("../services/userService.js");

exports.authUser = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });

    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userData = await findUserById(userId);

    if (!userData.success)
      return res.status(401).json({
        success: false,
        message: "User Not Found, Please Login again",
      });

    req.user = userData.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, invalid token" });
  }
};
