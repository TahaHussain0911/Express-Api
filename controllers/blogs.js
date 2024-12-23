const { StatusCodes } = require("http-status-codes");
const Blogs = require("../models/blogs");
const Category = require("../models/category");
const SubCategory = require("../models/sub-category");
const { generateSlug } = require("../utils/helper");
const getAllBlogs = async (req, res) => {
  try {
    const { search, category, subCategories, page = 1, limit = 10 } = req.query;
    let query = {};
    if (search) {
      query = {
        title: {
          $regex: search,
          $options: "i",
        },
      };
    }
    const blogs = await Blogs.find(query)
      .populate("category")
      .populate("user")
      .populate("subCategories")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(StatusCodes.OK).json({
      data: { blogs },
    });
  } catch (error) {
    next(error);
  }
};

const getSingleBlog = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const addBlog = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const { title, description, category, subCategories } = req.body;
    const categoryExists = await Category.exists({ _id: category });
    if (!categoryExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Category not found",
      });
    }
    const subCategoriesExists = await SubCategory.find({
      _id: { $in: subCategories }, // checking if in subcategories array any id matches
      category,
    });
    if (subCategoriesExists?.length !== subCategories?.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "One or more sub categories are invalid OR do not belong to the provided category",
      });
    }
    const blog = {
      title,
      description,
      category,
      subCategories,
      user: userId,
      images: req?.files?.map((file) => file?.filename),
    };
    const created_blog = await Blogs.create(blog);
    const populated_blog = await Blogs.aggregate([
      { $match: { _id: created_blog._id } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategories",
          foreignField: "_id",
          as: "subCategories",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      // unwind is for when there are multiple suppose subcategories destructure the array of path in unwind
      //   { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      //   { $unwind: { path: "$subCategories", preserveNullAndEmptyArrays: true } },
      //   { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    ]);
    // const created_blog = await Blogs.create(blog);
    // const populated_blog = await created_blog
    //   .populate("category")
    //   .populate("user")
    //   .populate("subCategories");
    console.log(populated_blog, "populated_blog");

    res.status(StatusCodes.CREATED).json({
      msg: "Blog Created",
      data: populated_blog?.[0],
    });
  } catch (error) {
    next(error);
  }
};
const updateBlog = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const deleteBlog = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllBlogs,
  getSingleBlog,
  addBlog,
  updateBlog,
  deleteBlog,
};
