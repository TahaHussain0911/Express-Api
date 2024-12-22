const { ObjectId } = require("mongodb");
const SubCategory = require("../models/sub-category");
const Category = require("../models/category");
const { StatusCodes } = require("http-status-codes");
const { transformObjectId } = require("../utils/helper");
const subCategory = require("../models/sub-category");
const getSubCategories = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    let query = {};
    if (search) {
      query = {
        subCategoryName: {
          $regex: search,
          $options: "i",
        },
      };
    }
    if (category) {
      const categoryId = transformObjectId(category);
      if (!categoryId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: "Invalid Category Id format",
        });
      }
      query = {
        ...query,
        category: categoryId,
      };
    }
    const sub_categories = await SubCategory.find(query)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(StatusCodes.OK).json({
      data: sub_categories,
    });
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
};
const getSingleSubCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const sub_category = await SubCategory.findOne({ slug }).populate(
      "category"
    );
    if (!sub_category) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Requested sub category doesnot exist!",
      });
    }
    res.status(StatusCodes.OK).json({
      data: sub_category,
    });
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
};
const addSubCategory = async (req, res, next) => {
  try {
    const { category, subCategoryName } = req.body;
    const params = {
      subCategoryName,
      category,
    };
    for (let key in params) {
      if (!params[key] || !params[key]?.trim?.()) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          msg: `Please provide ${key} field`,
        });
      }
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(StatusCodes.OK).json({
        msg: "Category does not exists",
      });
    }
    const sub_category = await SubCategory.create(params);
    if (!sub_category) {
      return (
        res,
        status(StatusCodes.EXPECTATION_FAILED).json({
          msg: "Creating Sub Category Failed",
        })
      );
    }
    res.status(StatusCodes.CREATED).json({
      msg: "Sub Category Created",
      data: sub_category,
    });
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
};
const updateSubCategory = async (req, res, next) => {
  try {
    const { categoryId, subCategoryName, subCategoryId } = req.body;
    if (!subCategoryId || !ObjectId.isValid(subCategoryId)) {
      return res.status(StatusCodes.CONFLICT).json({
        msg: "Please provide a valid subCategoryId",
      });
    }
    const sub_category = await SubCategory.findById(subCategoryId);
    if (!sub_category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Sub Category not found",
      });
    }
    if (categoryId && categoryId !== sub_category.category.toString()) {
      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) {
        return res.status(StatusCodes.CONFLICT).json({
          msg: "Category does not exists",
        });
      }
      sub_category.category = categoryId;
    }
    if (subCategoryName?.trim()) {
      sub_category.subCategoryName = subCategoryName;
    }
    const populatedSubCategory = await (
      await sub_category.save()
    ).populate("category");

    res.status(StatusCodes.OK).json({
      msg: "Sub Category Updated",
      data: populatedSubCategory,
    });
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
};
const deleteSubCategory = async (req, res, next) => {
  try {
    const subCategoryId = req.params.id;
    const subCategory = await SubCategory.findByIdAndDelete(subCategoryId);
    if (!subCategory) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Sub Category Not Found!",
      });
    }
    res.status(StatusCodes.OK).json({
      msg: "Sub Category Deleted",
      data: subCategory,
    });
  } catch (error) {
    console.log(error, "error");
    throw new Error(error.message);
  }
};

module.exports = {
  getSubCategories,
  getSingleSubCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
