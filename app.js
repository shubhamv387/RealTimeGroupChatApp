const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));

//Routers
const userRouter = require("./router/userRouter");
const chatRouter = require("./router/chatRouter");
const groupRouter = require("./router/groupRouter");

//Models
const User = require("./model/User");
const Chat = require("./model/Chat");
const Group = require("./model/Group");
const GroupUser = require("./model/GroupUser");

app.use("/api/users", userRouter);
app.use("/api/chatbox", chatRouter);
app.use("/api/group", groupRouter);

app.get("/", (req, res, next) => {
  res.status(200).json({ success: true, message: "HomePage" });
});

app.use((req, res, next) => {
  res
    .status(200)
    .json({ success: false, message: "Page not found", targetingURL: req.url });
});

User.hasMany(Chat);
Chat.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });

Group.hasMany(Chat);
Chat.belongsTo(Group, { constraints: true, onDelete: "CASCADE" });

const PORT = process.env.PORT || 3000;

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`server is running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log(err));
