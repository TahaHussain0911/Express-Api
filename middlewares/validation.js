const { StatusCodes } = require("http-status-codes");

const handleValidation = (error, req, res, next) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }
  next(error);
};

const formDataValidation = (req, res, next) => {
  try {
    if (req.headers["content-type"].includes("multipart/form-data")) {
      next();
      return;
    }
    res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json({
      msg: "Headers not supported",
    });
  } catch (error) {
    console.log(error, "error");

    res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Something went wrong",
    });
  }
};

const filterAllowedKeys = (allowedKeys) => {
  return (req, res, next) => {
    const filteredBody = {};
    const missingKeys = [];
    allowedKeys.forEach((key) => {
      if (req.body[key] !== undefined) {
        filteredBody[key] = req.body[key];
      } else {
        missingKeys.push(key);
      }
    });
    if (missingKeys?.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Missing required keys",
        missingKeys,
      });
    }
    req.body = filteredBody;
    next();
  };
};
module.exports = { handleValidation, formDataValidation, filterAllowedKeys };
