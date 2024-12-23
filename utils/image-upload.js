const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads");
  },
  filename: function (req, file, callback) {
    const fileName = Date.now() + path.extname(file.originalname);
    callback(null, fileName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, callback) {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed"), false);
    }
    callback(null, true);
  },
});
module.exports = { upload };
