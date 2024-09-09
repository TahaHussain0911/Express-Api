const mongoose = require("mongoose");
const { email_regex } = require("../utils/validation-regex");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function () {
      return this.isNew;
    },
    trim: true,
  },
  phone: {
    type: String,
    default: "",
  },
  photo: {
    type: String,
    default: "../uploads/cactus.jpg",
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [email_regex, "Please provide valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 8,
    select: false,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createToken = function () {
  const token = jwt.sign(
    {
      userId: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRY }
  );
  return token;
};

UserSchema.methods.comparePassword = async function (comparePass) {
  console.log(comparePass, "comparePass");

  const correctPassword = await bcrypt.compare(comparePass, this.password);
  return correctPassword;
};

module.exports = mongoose.model("Users", UserSchema);
