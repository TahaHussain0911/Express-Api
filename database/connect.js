const mongoose = require("mongoose");

const connectDb = (url) => {
  return mongoose
    .connect(url)
    .then((data) => console.log("DATABASE CONNECTED"))
    .catch((err) => console.log("DATABASE ERRROR=>", err));
};

module.exports = connectDb;
