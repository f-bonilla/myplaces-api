const express = require("express");
const router = express.Router();
const languageController = require("./language-controller");

router.post("/:lang", languageController.changeLang);

module.exports = router;
