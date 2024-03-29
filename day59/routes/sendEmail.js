var express = require("express");
var router = express.Router();

const SendEmailController = require("../controllers/email.controller");

router.get("/", SendEmailController.index);
router.post("/", SendEmailController.handleSendEmail);

router.get("/history", SendEmailController.history);
router.get("/history/:id", SendEmailController.historyDetail);

router.post("/email-history/destroy/:id", SendEmailController.destroy);

module.exports = router;
