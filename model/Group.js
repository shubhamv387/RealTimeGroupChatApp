const DataType = require("sequelize");
const sequelize = require("../config/database");

const Group = sequelize.define("group", {
  id: {
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  groupName: {
    type: DataType.STRING,
    allowNull: false,
  },
  groupAdminId: {
    type: DataType.STRING,
    allowNull: false,
  },
});

module.exports = Group;
