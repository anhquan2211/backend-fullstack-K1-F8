var express = require("express");
const forgotPasswordController = require("../controllers/forgot.password");

const authMiddleware = require("../middlewares/auth.middleware");
const tokenMiddleware = require("../middlewares/token.middleware");

var router = express.Router();

const checkToken =
  /* GET users listing. */
  router.get("/", authMiddleware, forgotPasswordController.index);
router.post("/", authMiddleware, forgotPasswordController.handleForgotPass);

router.get(
  "/verify/:token",
  authMiddleware,
  tokenMiddleware,
  forgotPasswordController.resetPassword
);

router.post(
  "/verify/:token",
  authMiddleware,
  tokenMiddleware,
  forgotPasswordController.handleResetPassword
);

module.exports = router;
