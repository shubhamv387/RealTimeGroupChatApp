const { Transaction } = require("sequelize");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const Group = require("../model/Group");

exports.findAllUsers = async () => {
  return await User.findAll(
    {
      attributes: [
        "id",
        "fullName",
        "email",
        "phone",
        "createdAt",
        "updatedAt",
      ],
    },
    { include: Group }
  );
};

exports.findUserById = async (id) => {
  try {
    const user = await User.findOne(
      { where: { id } },
      {
        attributes: { exclude: ["password"] },
      },
      { where: { id } }
    );
    if (user) return { success: true, user: user };
    return { success: false, message: `user not found with Id: ${id}` };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

exports.findUserWithPassById = async (id) => {
  try {
    const user = await User.findOne({ where: { id } });
    if (user) return { success: true, user };
    return { success: false, message: `user not found with Id: ${id}` };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

exports.findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      return {
        success: true,
        user,
      };
    } else return { success: false, message: `Email does not exists!` };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};

exports.createNewUser = async (user, t) => {
  const { fullName, email, phone, password } = user;

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync(password, salt);
    const createdUser = await User.create(
      {
        fullName,
        email,
        phone,
        password: hashedPass,
      },
      { transaction: t }
    );

    return {
      success: true,
      createdUser,
    };
  } catch (error) {
    console.log(error.message);
    return { success: false, message: "Something went wrong!" };
  }
};
