const mongoose = require("mongoose");
const slugify = require("slugify");
const SubCategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryName: {
      type: String,
      required: [true, "Sub Category Name is required!"],
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
// SubCategorySchema.pre("save", async function (next) {
//   try {
//     this.subCategoryName = this.subCategoryName.trim();
//     const existingSubCategory = await mongoose.model("SubCategory").findOne({
//       category: this.category,
//       subCategoryName: this.subCategoryName,
//     });
//     if (existingSubCategory) {
//       const error = new Error("Sub Category Name exists");
//       return next(error);
//     }
//     next();
//   } catch (error) {
//     console.log(error, "error");
//     throw new Error(error?.message);
//   }
// });
// runs before validating schema
SubCategorySchema.pre("validate", function (next) {
  try {
    if (this.isModified("subCategoryName")) {
      this.slug = slugify(this.subCategoryName, {
        replacement: "-",
        lower: true,
        trim: true,
        strict: true,
      });
    }
    if (this.subCategoryName) {
      this.subCategoryName = this.subCategoryName.trim();
    }
    next();
  } catch (error) {
    console.log(error, "error");
    throw new Error(error?.message);
  }
});
SubCategorySchema.index(
  { category: 1, subCategoryName: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

module.exports = mongoose.model("SubCategory", SubCategorySchema);
