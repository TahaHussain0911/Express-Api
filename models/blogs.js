const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const BlogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      minLength: 4,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [
        {
          type: String,
          default: "../uploads/cactus.jpg",
        },
      ],
      validate: {
        validator: function (images) {
          return Array.isArray(images) && images?.length > 0;
        },
        message: "Atleast one image is required",
      },
    },
    slug: {
      type: String,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategories: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubCategory",
        },
      ],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v?.length > 0;
        },
        message: "Atleast one sub category is required",
      },
    },
  },
  {
    timestamps: true,
  }
);

BlogSchema.pre("validate", function (next) {
  try {
    if (this.isModified('title')) {
      this.slug = slugify(this.title, {
        lower: true,
        trim: true,
        strict: true,
        replacement: "-",
      });
      console.log(this.slug, "this.slug");
    }

    next();
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = mongoose.model("Blogs", BlogSchema);
