var express = require("express");
var router = express.Router();

const path = require("path");
const fs = require("fs");

const model = require("../models/index");
const email = model.email;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/open-mail", async function (req, res, next) {
  // fs.writeFileSync("data.txt", "ok");
  const { id } = req.query;

  try {
    const emailSeen = await email.findByPk(id);

    if (emailSeen) {
      await emailSeen.update({ status: true });
    } else {
      // Handle case when the email with the given id is not found
      console.log(`Email with ID ${id} not found.`);
    }

    res.set("Content-Type", "image/png");
    res.sendFile(path.join(__dirname, "../public", "tracking.png"));
  } catch (error) {
    return next(error);
  }
});

router.get("/get-tracking", async function (req, res) {
  res.send("tracking-email");
});

module.exports = router;
