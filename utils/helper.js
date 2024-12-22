const { ObjectId } = require("mongodb");
const transformObjectId = (id) => {
  try {
    const objectId = new ObjectId(id);
    return objectId;
  } catch (error) {
    return false;
  }
};
module.exports = {
  transformObjectId,
};
