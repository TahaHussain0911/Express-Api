const mongoose = require("mongoose");
const slugify = require("slugify");
const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category Name is required!"],
      minLength: 3,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

// runs before validating schema
CategorySchema.pre("validate", function (next) {
  try {
    if (this.isModified("categoryName")) {
      this.slug = slugify(this.categoryName, {
        replacement: "-",
        lower: true,
        trim: true,
        strict: true,
      });
    }
    if (this.categoryName) {
      this.categoryName = this.categoryName.trim();
    }
    next();
  } catch (error) {
    console.log(error, "error");
    throw new Error(error?.message);
  }
});
module.exports = mongoose.model("Category", CategorySchema);
