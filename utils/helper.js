const { ObjectId } = require("mongodb");
const { default: slugify } = require("slugify");
const path = require("path");
const fs = require("fs");

const transformObjectId = (id) => {
  try {
    const objectId = new ObjectId(id);
    return objectId;
  } catch (error) {
    return false;
  }
};
const generateSlug = (field) => {
  try {
    const slug = slugify(field, {
      lower: true,
      trim: true,
      strict: true,
      replacement: "-",
    });
    return slug;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteImageLocally = async (file) => {
  const filename = path.join(__dirname, "..", "uploads", file);
  try {
    await fs.promises.access(filename, fs.constants.F_OK);
    await fs.promises.unlink(filename);
    return true;
  } catch (error) {
    console.error(error.message);
    throw new Error("Error deleting file!");
  }
};
module.exports = {
  transformObjectId,
  generateSlug,
  deleteImageLocally,
};
