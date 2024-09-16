const mongoose = require("mongoose");
const { email_regex } = require("../utils/validation-regex");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
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
    otp: {
      type: String,
      select: false,
    },
    otpExpiresAt: {
      type: Date,
      select: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 8,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  console.log(this.isModified, "this.isModifiedddd");

  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // passwordChangedAt field updated to the current date when password is modified
  // for token verification
  this.passwordChangedAt = new Date();
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
