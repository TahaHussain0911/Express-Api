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
      return
    }
    res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json({
      msg: "Headers not supported",
    });
  } catch (error) {
    console.log(error,'error');
    
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Something went wrong",
    });
  }
};

module.exports = { handleValidation, formDataValidation };
