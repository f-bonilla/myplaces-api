const i18n = require("i18n");
const createError = require("../error-handler").createError;
const document = require("./place-model");

const executeCreate = async (req) => {
  req.body.user = req.user.id;
  const doc = new document(req.body);
  await doc.save();
  return doc;
};
const create = async (req, res, next) => {
  try {
    const doc = await executeCreate(req);
    res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

const executeRead = async (filter) => await document.findOne(filter);
const read = async (req, res, next) => {
  try {
    const doc = await executeRead({ _id: req.params.id, public: true });
    if (!doc) return next(createError(404));
    res.status(200).json(doc);
  } catch (err) {
    next(err);
  }
};

// NOTE: it is necessary?
const executeUpdate = async () => {};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password, role } = req.body;
    const filter = { _id: id };
    const update = { email: email, password: password, role: role };
    const doc = await document.findOneAndUpdate(filter, update, { new: true });
    if (!doc) return next(createError(404));
    res.status(200).json({ message: i18n.__("updated_resource", doc._id) });
  } catch (err) {
    next(err);
  }
};

const executeDestroy = async (req) => {
  const { id } = req.params;
  const doc = await document.findOneAndDelete({ _id: id });
  return doc;
};
const destroy = async (req, res, next) => {
  try {
    const doc = await executeDestroy(req);
    if (!doc) return next(createError(404));
    res.status(200).json({ message: i18n.__("deleted_resource", doc._id) });
  } catch (err) {
    next(err);
  }
};

const executePatch = async (req) => {
  const { body } = req;
  const doc = await executeRead({ _id: req.params.id });
  const validFields = Object.keys(doc._doc);
  for (const data in body.updateData) {
    if (validFields.includes(data)) {
      doc[data] = body.updateData[data];
    }
  }
  await doc.save();
  return doc;
};
const patch = async (req, res, next) => {
  try {
    await executePatch(req);
    res.status(200).json({
      message: i18n.__("updated_resource"),
    });
  } catch (err) {
    next(err);
  }
};

const executeList = async (filter = {}) => {
  const collection = await document.find(filter);
  return collection.map((doc) => ({
    id: doc._id,
    name: doc.name,
    state: doc.state,
    option: doc.option,
    option_type: doc.option_type,
    province: doc.province,
    locality: doc.locality,
    address: doc.address,
    description: doc.description,
    image: doc.image,
    phone: doc.phone,
    email: doc.email,
    web: doc.web,
    public: doc.public,
    votes: doc.votes,
  }));
};
const list = async (req, res, next) => {
  const reqFilter = req.body.filter ? JSON.parse(req.body.filter) : {};
  const filter = { ...reqFilter, public: true };
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
    create,
    read,
    update,
    destroy,
    patch,
    list,
  },
  // internal use
  api: {
    executeCreate,
    executeRead,
    executeUpdate,
    executeDestroy,
    executePatch,
    executeList,
  },
};
