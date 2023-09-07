const express = require("express");
const {
  resetForgotPassword,
  createNewPassword,
  PostCreateNewPassword,
} = require("../controller/userPassword");

const router = express.Router();

router.post("/forgotpassword", resetForgotPassword);

router
  .route("/resetpassword/:id")
  .get(createNewPassword)
  .post(PostCreateNewPassword);

module.exports = router;
