const { StatusCodes } = require("http-status-codes");
const Category = require("../models/category");
const getCategories = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 40 } = req.query;
    let query = {};
    if (search) {
      query = {
        categoryName: { $regex: search, $options: "i" },
      };
    }
    const categories = await Category.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(StatusCodes.OK).json({
      data: { categories },
    });
  } catch (error) {
    console.log(error, "error");
    throw new Error(error.message);
  }
};
const getSingleCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const found_category = await Category.findOne({ slug });
    if (!found_category) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Requested category doesnot exist!",
      });
    }
    res.status(StatusCodes.OK).json({
      data: found_category,
    });
  } catch (error) {
    console.log(error, "error");
    throw new Error(error.message);
  }
};
const addCategory = async (req, res,next) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Please provide categoryName field",
      });
    }
    const category_created = await Category.create(req.body);
    if (category_created) {
      return res.status(StatusCodes.CREATED).json(category_created);
    }
    res.status(StatusCodes.EXPECTATION_FAILED).json({
      msg: "Creating Category Failed!",
    });
  } catch (error) {
    console.log(error, "error");
    // throw new Error(error.message);
    next(error);
  }
};
const updateCategory = async (req, res) => {};
const deleteCategory = async (req, res) => {};

module.exports = {
  getCategories,
  getSingleCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
