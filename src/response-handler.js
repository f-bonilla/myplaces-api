const responseHandler = async (req, res, next) => {
  res.status(200).json(res.locals.data);
};

module.exports = responseHandler;
