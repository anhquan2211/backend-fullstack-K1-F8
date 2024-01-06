var express = require("express");
var router = express.Router();

const authController = require("../controllers/auth.controller.js");
const guestMiddleware = require("../middlewares/guest.middleware.js");

router.post("/logout", authController.logout);

router.use(guestMiddleware);

router.get("/login", authController.index);

router.post("/login", authController.handleLogin);

module.exports = router;
