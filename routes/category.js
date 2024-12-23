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
router.get("/", getCategories).get("/:slug", getSingleCategory);

// commend this as middleware will be applied on below all routers if defined
router.use([authorize_token, authorize_admin]);

router.post("/", addCategory, duplicateKeyError);

router.patch("/", updateCategory, duplicateKeyError);

router.delete("/:id", deleteCategory);

module.exports = router;
