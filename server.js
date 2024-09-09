require("dotenv").config();
const express = require("express");
const connectDb = require("./database/connect");
const UserRouter = require("./routes/user");
const path = require("path");
const notFound = require("./middlewares/notFound");
const PORT = process.env.NODE_PORT;
const MONGO_URL = process.env.DATABASE_URL;
const app = express();
app.use("/", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/v1/auth", UserRouter);

app.use(notFound);

const start = async () => {
  try {
    await connectDb(MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Server listening on PORT ${PORT}`);
    });
  } catch (error) {
    console.log("error=>", error);
  }
};

start();
