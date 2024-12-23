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
// no need to use this as api/v1 is forwarding 
// authorize token middleware from category.js
router.use(authorize_token);
router.get("/", getAllBlogs).get("/:slug", getSingleBlog);

router.post(
  "/",
  formDataValidation,
  upload.array("images", 4),
  addBlog,
  duplicateKeyError
);

router.patch(
  "/",
  formDataValidation,
  upload.array("images", 4),
  updateBlog,
  duplicateKeyError
);
router.delete("/:id", deleteBlog);
module.exports = router;
