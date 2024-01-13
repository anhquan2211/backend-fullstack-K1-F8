var express = require("express");
var router = express.Router();

const homeController = require("../controllers/home.controller");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/info", homeController.info);
router.post("/info", homeController.handleInfo);

router.get("/password", homeController.password);
router.post("/password", homeController.handlePassword);

module.exports = router;
