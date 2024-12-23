const express = require("express");
const { authorize_token } = require("../middlewares/authorization");

const {
  duplicateKeyError,
  formDataValidation,
} = require("../middlewares/validation");
const {
  getAllBlogs,
  getSingleBlog,
  addBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogs");
const { upload } = require("../utils/image-upload");
const router = express.Router();
router.use(authorize_token);
router.get("/blogs", getAllBlogs).get("/blogs/:slug", getSingleBlog);

router.post(
  "/blogs",
  formDataValidation,
  upload.array("images", 4),
  addBlog,
  duplicateKeyError
);

router.patch(
  "/blogs",
  formDataValidation,
  upload.array("images", 4),
  updateBlog,
  duplicateKeyError
);
router.delete("/blogs/:id", deleteBlog);
module.exports = router;
