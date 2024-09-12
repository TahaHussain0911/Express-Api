const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const currentDate = new Date();
const authorize_token = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(StatusCodes.FORBIDDEN).json({
      msg: "Not Authorized",
    });
  }
  const token = authorization.split("Bearer ")[1];
  try {
    // did not put password changed at in token because the old token iat and passwortChanged at will always be same
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const found_user = await User.findById(user?.userId).select(
      "passwordChangedAt"
    );
    const passwordChangedAt = Math.floor(
      new Date(found_user?.passwordChangedAt).getTime() / 1000
    ); // converted to seconds to compare with iat

    if (user?.iat < passwordChangedAt) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Password has been changed recently, please log in again",
      });
    }
    if (user.exp <= currentDate.getTime() / 1000) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Token expired",
      });
    }
    req.user = { userId: user?.userId, name: user?.name };
    next();
  } catch (error) {
    res.status(StatusCodes.FORBIDDEN).json({
      msg: "NOT AUTHORIZED!",
    });
  }
};

module.exports = authorize_token;
