const document = require("./option-model");

const executeList = async (filter = {}) => {
  const collection = await document.find(filter);
  return collection.map((doc) => ({
    id: doc._id,
    category_id: doc.category_id,
    label: doc.label,
  }));
};
const list = async (req, res, next) => {
  const filter = req.body.filter ? JSON.parse(req.body.filter) : {};
  try {
    const collection = await executeList(filter);
    res.status(200).json(collection);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  // external use
  routes: {
    list,
  },
  // internal use
  api: {
    executeList,
  },
};
