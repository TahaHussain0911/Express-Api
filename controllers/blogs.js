const { StatusCodes } = require("http-status-codes");
const Blogs = require("../models/blogs");
const Category = require("../models/category");
const SubCategory = require("../models/sub-category");
const { generateSlug, transformObjectId } = require("../utils/helper");
const { ObjectId } = require("mongodb");
const getAllBlogs = async (req, res) => {
  try {
    const { userId, role } = req.user;
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
    if (category) {
      const categoryId = transformObjectId(category);
      query = {
        ...query,
        category: categoryId,
      };
    }
    if (subCategories) {
      const splittedSubCategories = subCategories?.split(",");
      if (splittedSubCategories?.length > 0) {
        query = { ...query, subCategories: { $in: splittedSubCategories } };
      }
    }
    if (role !== "admin") {
      query = {
        ...query,
        user: userId,
      };
    }
    console.log(query, "query");

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
    // const created_blog = new Blogs(blog);
    // cannot use multiple populate with .save()
    // const populated_blog = await (await created_blog.save())
    //   .populate("category")
    //   .populate("subCategories")
    //   .populate("user");
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
    res.status(StatusCodes.CREATED).json({
      msg: "Blog Created",
      //   data: populated_blog?.[0],
      data: populated_blog,
    });
  } catch (error) {
    next(error);
  }
};
const updateBlog = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const imageFiles = req?.files?.map((file) => file?.filename);
    const { blogId, category, subCategories, title, description } = req.body;
    const blog = await Blogs.findById(blogId);
    if (!blog) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Blog Not Found",
      });
    }
    if (userId !== blog?.user?.toString() && role !== "admin") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "You are not authorized to update this blog!",
      });
    }
    if (category && category !== blog?.category?.toString()) {
      console.log("unqueal category");

      const categoryExists = await Category.exists({
        _id: category,
      });
      if (!categoryExists) {
        return res.status(StatusCodes.CONFLICT).json({
          msg: "Category does not exists",
        });
      }
      if (subCategories && Array.isArray(subCategories)) {
        const subCategoriesExists = await SubCategory.find({
          _id: { $in: subCategories },
          category,
        });
        console.log(subCategoriesExists, "subCategoriesExists");
        console.log(subCategories, "subCategories");

        if (subCategoriesExists?.length !== subCategories?.length) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            msg: "One or more sub categories are invalid OR do not belong to the provided category",
          });
        }
      }
    }
    if (
      subCategories &&
      Array.isArray(subCategories) &&
      category === blog?.category?.toString()
    ) {
      // as id is in ObjectId(id) therefor converting it to string first to compare
      const existingSubCategories = blog?.subCategories?.map((ele) =>
        ele?.toString()
      );
      // to check only on those sub categories which are newly added
      const newSubCategories = subCategories?.filter((ele) => {
        return ObjectId.isValid(ele) && !existingSubCategories?.includes(ele);
      });
      if (newSubCategories?.length > 0) {
        const subCategoriesExists = await SubCategory.find({
          _id: { $in: newSubCategories },
          category: blog?.category?.toString(),
        });
        if (subCategoriesExists?.length !== newSubCategories?.length) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            msg: "One or more sub categories are invalid OR do not belong to the provided category",
          });
        }
      }
    }
    const params = {
      title,
      description,
      images: [...blog?.images, ...imageFiles],
      category,
      subCategories,
    };
    Object.entries(params).forEach(([key, value]) => {
      if (value && (!Array.isArray(value) || value.length > 0)) {
        blog[key] = value;
      }
    });
    await blog.save();
    const populated_blog = await Blogs.aggregate([
      { $match: { _id: blog?._id } },
      {
        $lookup: {
          from: "categories",
          foreignField: "_id",
          localField: "category",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "user",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          foreignField: "_id",
          localField: "subCategory",
          as: "subCategory",
        },
      },
    ]);
    res.status(StatusCodes.CREATED).json({
      msg: "Blog Created",
      data: populated_blog,
    });
  } catch (error) {
    next(error);
  }
};
const deleteBlog = async (req, res, next) => {
  try {
    const { userId, role } = req.user;
    const blogId = req.params.id;
    const blog = await Blogs.findOneAndDelete({
      _id: blogId,
      $or: [{ user: userId }, { role: "admin" }],
    });
    if (!blog) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Blog not found!",
      });
    }
    res.status(StatusCodes.OK).json({
      msg: "Blog Deleted",
      data: blog,
    });
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
