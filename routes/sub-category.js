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

router.get("/", getSubCategories).get("/:slug", getSingleSubCategory);
router.use([authorize_token, authorize_admin]);

router.post("/", addSubCategory, duplicateKeyError);

router.patch("/", updateSubCategory, duplicateKeyError);
router.delete("/:id", deleteSubCategory);
module.exports = router;
