const express = require("express");
const {
  authorize_admin,
  authorize_token,
} = require("../middlewares/authorization");
const { duplicateKeyError } = require("../middlewares/validation");
const {
  getSubCategories,
  getSingleSubCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/sub-category");
const router = express.Router();

router
  .get("/sub-category", getSubCategories)
  .get("/sub-category/:slug", getSingleSubCategory);
router.use([authorize_token, authorize_admin]);

router.post("/sub-category", addSubCategory, duplicateKeyError);

router.patch("/sub-category", updateSubCategory, duplicateKeyError);
router.delete("/sub-category/:id", deleteSubCategory);
module.exports = router;
