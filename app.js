const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));

//Routers
const userRouter = require("./router/userRouter");

app.use("/api/users", userRouter);

app.get("/", (req, res, next) => {
  res.status(200).json({ success: true, message: "HomePage" });
});

app.use((req, res, next) => {
  res
    .status(200)
    .json({ success: false, message: "Page not found", targetingURL: req.url });
});

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
