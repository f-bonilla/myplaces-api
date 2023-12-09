const express = require("express");
const router = express.Router();
const controller = require("./place-controller").routes;

router.post("/", controller.create);
router.get("/:id", controller.read);
router.put("/:id", controller.update);
router.delete("/:id", controller.destroy);
router.patch("/:id", controller.patch);
router.get("/", controller.list);

module.exports = router;
