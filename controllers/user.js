const User = require("../models/user");
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
  const { currentPassword, newPassword } = req.body;
  const { userId } = req.user;
  const user = await User.findOne({
    _id: userId,
  });
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
};
module.exports = { login, signup, updateUser, getUser, updatePassword };
