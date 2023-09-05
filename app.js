const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./config/database");
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);

require("dotenv").config();

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

app.use(express.static(path.join(__dirname, "public")));

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
    server.listen(PORT, () =>
      console.log(`server is running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log(err));

// Chatroom

io.on("connection", (socket) => {
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on("new message", (data) => {
    // we tell the client to execute 'new message'
    if (!data.createdChat.groupId)
      socket.broadcast.emit("new message", {
        currentUserName: socket.data.currentUserName,
        message: data,
      });
    else
      socket.to(socket.data.groupId).emit("new message", {
        currentUserName: socket.data.currentUserName,
        message: data,
      });
  });

  // when the client emits 'add user', this listens and executes
  socket.on("add user", (data) => {
    if (addedUser) return;
    // we store the currentUserName in the socket session for this client
    socket.data = data;

    addedUser = true;
    socket.emit("login", {
      data,

      message: "login into chat",
    });
    // echo globally (all clients) that a person has connected
    if (!data.groupId)
      socket.broadcast.emit("user joined", {
        data: socket.data,

        message: "joined chat",
      });
    else
      socket.to(socket.data.groupId).emit("user joined", {
        data: socket.data,

        message: "joined chat",
      });
  });

  socket.on("join-group", (groupId) => {
    socket.join(groupId);
  });

  // when the user disconnects.. perform this
  socket.on("disconnect", () => {
    if (addedUser) {
      // echo globally that this client has left
      socket.to(socket.data.groupId).emit("user left", {
        data: socket.data,

        message: "left chat",
      });
    }
  });
});
