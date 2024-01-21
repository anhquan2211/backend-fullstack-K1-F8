var express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const loginController = require("../controllers/login.controller");
const passport = require("passport");

var router = express.Router();

/* GET users listing. */
router.get("/", authMiddleware, loginController.index);
router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  loginController.handleLogin
);

router.get("/google/redirect", passport.authenticate("google"));

router.get("/google/callback", passport.authenticate("google"));

module.exports = router;
