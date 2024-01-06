const { User } = require("../models");

module.exports = {
  index: (req, res) => {
    const { userLogin } = req.session;
    const success = req.flash("success");

    res.render("index", { userLogin, success });
  },
};
