const express = require("express");
const router = express.Router();
const controller = require("./option-type-controller").routes;

router.get("/", controller.list);

module.exports = router;
