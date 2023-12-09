const express = require("express");
const router = express.Router();
const controller = require("./place-option-type-controller").routes;

router.get("/", controller.list);

module.exports = router;
