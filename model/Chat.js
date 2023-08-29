const DataType = require("sequelize");
const sequelize = require("../config/database");

const Chat = sequelize.define("chat", {
  id: {
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  chat: {
    type: DataType.STRING,
    allowNull: false,
  },
});

module.exports = Chat;
