const DataType = require("sequelize");
const sequelize = require("../config/database");

const GroupUser = sequelize.define("groupUser", {
  id: {
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  isGroupAdmin: {
    type: DataType.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = GroupUser;
