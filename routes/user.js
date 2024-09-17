const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  updateUser,
  getUser,
  updatePassword,
  sendOtpCode,
  verifyOtp,
} = require("../controllers/user");
const {
  handleValidation,
  formDataValidation,
  filterAllowedKeys,
} = require("../middlewares/validation");
const { upload } = require("../utils/image-upload");
const { allowedKeysForUpdatePassword } = require("../utils/required-keys");
const authorize_token = require("../middlewares/authorization");

router.post("/login", login).post("/signup", signup, handleValidation);
router.post("/send-otp", sendOtpCode);
router.post("/verify-otp", verifyOtp);

router.use(authorize_token);
router.patch(
  "/updateMe",
  formDataValidation,
  upload.single("photo"),
  updateUser
);
router.get("/getMe", getUser);
router.patch(
  "/update-password",
  filterAllowedKeys(allowedKeysForUpdatePassword),
  updatePassword
);

module.exports = router;
