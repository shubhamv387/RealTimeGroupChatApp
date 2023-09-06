const DataType = require("sequelize");
const sequelize = require("../config/database");

const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
  id: {
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  },
  isActive: {
    type: DataType.BOOLEAN,
    allowNull: false,
  },
});

module.exports = ForgotPasswordRequest;
