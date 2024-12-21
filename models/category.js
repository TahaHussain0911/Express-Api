const mongoose = require("mongoose");
const slugify = require("slugify");
const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category Name is required!"],
      minLength: 3,
      unique: true,
      collation: { locale: "en", strength: 2 },
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
      console.log(this.slug,'this.slug');
      
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
CategorySchema.index({ categoryName: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
CategorySchema.index({ slug: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });
module.exports = mongoose.model("Category", CategorySchema);
