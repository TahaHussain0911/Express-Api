require("dotenv").config();
const express = require("express");
const connectDb = require("./database/connect");
const UserRouter = require("./routes/user");
const CategoryRouter = require("./routes/category");
const SubCategoryRouter = require("./routes/sub-category");
const BlogsRouter = require("./routes/blogs");
const path = require("path");
const notFound = require("./middlewares/notFound");
const PORT = process.env.NODE_PORT;
const MONGO_URL = process.env.DATABASE_URL;
const app = express();
app.use("/", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/v1/auth", UserRouter);
app.use("/api/v1", CategoryRouter);
app.use("/api/v1", SubCategoryRouter);
app.use("/api/v1", BlogsRouter);

app.use(notFound);
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    msg: "Something went wrong.",
    error: err.message,
  });
});
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
