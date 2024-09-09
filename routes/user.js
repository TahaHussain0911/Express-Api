const express = require("express");
const router = express.Router();
const { login, signup, updateUser, getUser } = require("../controllers/user");
const {
  handleValidation,
  formDataValidation,
} = require("../middlewares/validation");
const authorize_token = require("../middlewares/authorization");
const { upload } = require("../utils/image-upload");

router.post("/login", login).post("/signup", signup, handleValidation);

router.use(authorize_token);
router.patch(
  "/updateMe",
  formDataValidation,
  upload.single("photo"),
  updateUser
);
router.get("/getMe", getUser);
module.exports = router;
