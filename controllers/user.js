const User = require("../models/user");
const OtpModel = require("../models/otp");
const otpGenerator = require("otp-generator");
const { StatusCodes } = require("http-status-codes");
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Email or Password key missing!" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid Credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid Credentials" });
    }
    const { name, _id } = user;
    const token = user.createToken();
    res.status(StatusCodes.OK).json({
      user: {
        email,
        name,
        _id,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { body } = req;
    const user_exist = await User.findOne({ email: body?.email });
    if (user_exist) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "User already exists" });
    }
    const created_user = await User.create({ ...body });
    const token = created_user.createToken();
    if (created_user) {
      const { email, name, _id } = created_user;
      return res.status(StatusCodes.CREATED).json({
        user: { email, name, _id },
        token,
      });
    }
    res.status(StatusCodes.EXPECTATION_FAILED).json({ msg: "Signup" });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        photo: req.file?.filename,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json({
      msg: "User Updated",
      data: updatedUser,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findOne({
      _id: userId,
    });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Not Authorized",
      });
    }
    res.status(StatusCodes.OK).json({
      data: user,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error);
  }
};
const updatePassword = async (req, res) => {
  const { currentPassword, password } = req.body;
  const { userId } = req.user;
  const user = await User.findOne({
    _id: userId,
  }).select("+password +passwordChangedAt"); // explicitly selecting password due to select false in schema
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Not Authorized",
    });
  }
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Current password is not correct",
    });
  }
  if (currentPassword === password) {
    return res.status(StatusCodes.CONFLICT).json({
      msg: "Current and new password are same!",
    });
  }
  try {
    user.password = password;
    await user.save();
    const token = user.createToken();
    return res.status(StatusCodes.OK).json({
      data: {
        token,
      },
      msg: "Password Updated",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Something went wrong!",
    });
  }
};
const sendOtpCode = async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "User with this email not exists",
      });
    }
    let otp_generated = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    let otpExists = await OtpModel.findOne({ otp: otp_generated });
    // check if otp exists in the db
    while (otpExists) {
      otp_generated = otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      otpExists = await OtpModel.findOne({ otp: otp_generated });
    }
    await OtpModel.create({ email, otp: otp_generated });
    return res.status(StatusCodes.OK).json({
      msg: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error, "error");

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  const { otp, email } = req.body;
  try {
    let otpExists = await OtpModel.findOne({ email });

    if (!otpExists) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "User with this email not exists",
      });
    }
    if (otpExists?.otp == otp) {
      return res.status(StatusCodes.OK).json({
        msg: "OTP verified successfully",
      });
    }
  } catch (error) {
    console.log(error, "error");

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
    });
  }
};

module.exports = {
  login,
  signup,
  updateUser,
  getUser,
  updatePassword,
  sendOtpCode,
  verifyOtp,
};
