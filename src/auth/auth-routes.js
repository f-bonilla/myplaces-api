const express = require("express");
const router = express.Router();
const auth = require("./auth-controller");

router.post("/login", auth.login);
router.post("/register", auth.register);
router.post("/logout", auth.logout);
router.get("/confirm-user", auth.confirmUser);

module.exports = router;
