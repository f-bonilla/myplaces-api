const express = require("express");
const router = express.Router();
const controller = require("./place-state-controller").routes;

router.get("/", controller.list);

module.exports = router;
