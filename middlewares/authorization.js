const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const currentDate = new Date();
const authorize_token = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(StatusCodes.FORBIDDEN).json({
      msg: "Not Authorized",
    });
  }
  const token = authorization.split("Bearer ")[1];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (user?.exp < currentDate.getTime()) {
      res.status(StatusCodes.UNAUTHORIZED).json({
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
