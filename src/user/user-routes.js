const express = require("express");
const router = express.Router();
const controller = require("./user-controller").routes;

/* router.post("/register", user.register);
router.post("/login", user.login); */
router.post("/", controller.create);
router.get("/:id", controller.read); // TODO: por probar
router.put("/:id", controller.update);
router.delete("/:id", controller.destroy);
router.patch("/:id", controller.patch);
// NOTE: el caso de controller.list no es necesario (admins)
// es para llevarlo a places cuando se haga copy/paste
// router.get("/", controller.list);

module.exports = router;
