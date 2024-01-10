const express = require("express");
const router = express.Router();
const controller = require("./user-controller").routes;

router.post("/", controller.create);
router.get("/:id", controller.read); // TODO: test
router.put("/:id", controller.update);
router.delete("/:id", controller.destroy);
router.patch("/:id", controller.patch);

module.exports = router;
