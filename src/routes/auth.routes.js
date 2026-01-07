const express = require("express");
const router = express.Router();

const guest = require("../middleware/guest");
const auth = require("../middleware/auth");
const ctrl = require("../controllers/auth.controller");

router.get("/login", guest, ctrl.loginForm);
router.post("/login", guest, ctrl.login);

router.get("/register", guest, ctrl.registerForm);
router.post("/register", guest, ctrl.register);

router.post("/logout", auth, ctrl.logout);

module.exports = router;
