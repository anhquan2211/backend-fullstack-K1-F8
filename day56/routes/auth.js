var express = require("express");
var router = express.Router();

const authController = require("../controllers/auth.controller.js");
const guestMiddleware = require("../middlewares/guest.middleware.js");
const validate = require("../utils/validate");

router.post("/logout", authController.logout);

router.use(guestMiddleware);

router.get("/login", authController.index);

router.post("/login", authController.handleLogin);

router.get("/register", authController.register);
router.post("/register", validate.register(), authController.handleRegister);

module.exports = router;
