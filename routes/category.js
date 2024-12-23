const express = require("express");
const {
  authorize_admin,
  authorize_token,
} = require("../middlewares/authorization");
const {
  getCategories,
  getSingleCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { duplicateKeyError } = require("../middlewares/validation");
const router = express.Router();
router
  .get("/category", getCategories)
  .get("/category/:slug", getSingleCategory);

router.use([authorize_token, authorize_admin]);

router.post("/category", addCategory, duplicateKeyError);

router.patch("/category", updateCategory, duplicateKeyError);

router.delete("/category/:id", deleteCategory);

module.exports = router;
