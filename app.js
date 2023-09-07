const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./config/database");
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://127.0.0.1:5500"],
  },
});

require("dotenv").config();

app.use(express.json());

app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));

//Routers
const userRouter = require("./router/userRouter");
const chatRouter = require("./router/chatRouter");
const groupRouter = require("./router/groupRouter");
const userPasswordRouter = require("./router/userPassword");

//Models
const User = require("./model/User");
const Chat = require("./model/Chat");
const Group = require("./model/Group");
const GroupUser = require("./model/GroupUser");
const ChatArchive = require("./model/ChatArchive");

//services
const { archiveCron } = require("./services/chatArchiveServices");
const ForgotPasswordRequest = require("./model/ForgotPasswordRequests");

app.use("/api/users", userRouter);
app.use("/password", userPasswordRouter);
app.use("/api/chatbox", chatRouter);
app.use("/api/group", groupRouter);

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.status(200).json({ success: false, message: "page not found!" });
});

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, `public/${req.url}`));
// });

User.hasMany(Chat);
Chat.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});

User.hasMany(ChatArchive);
ChatArchive.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });

Group.hasMany(Chat);
Chat.belongsTo(Group, { constraints: true, onDelete: "CASCADE" });

Group.hasMany(ChatArchive);
ChatArchive.belongsTo(Group, { constraints: true, onDelete: "CASCADE" });

const PORT = process.env.PORT || 3000;

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    server.listen(PORT, () =>
      console.log(
        `server is running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
      )
    );
  })
  .catch((err) => console.log(err));

// Chatroom

io.on("connection", (socket) => {
  let addedUser = false;

  socket.on("join-group", (groupId) => {
    socket.join(groupId);
  });

  // when the client emits 'new message', this listens and executes
  socket.on("new message", (data) => {
    // we tell the client to execute 'new message'
    socket.to(socket.data.groupId).emit("new message", {
      currentUserName: socket.data.currentUserName,
      message: data,
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on("add user", (data) => {
    // console.log(data);
    if (addedUser) return;
    // we store the currentUserName in the socket session for this client
    socket.data = data;
    addedUser = true;
    socket.emit("login", {
      data,
      message: "login into chat",
    });
    // echo that a person has connected
    socket.to(socket.data.groupId).emit("user joined", {
      data: socket.data,
      message: "joined chat",
    });
  });

  // when the user disconnects.. perform this
  socket.on("disconnect", () => {
    if (addedUser) {
      // echo that this client has left
      socket.to(socket.data.groupId).emit("user left", {
        data: socket.data,

        message: "left chat",
      });
    }
  });
});

archiveCron.start();
