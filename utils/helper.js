const { ObjectId } = require("mongodb");
const { default: slugify } = require("slugify");
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
module.exports = {
  transformObjectId,
  generateSlug,
};
