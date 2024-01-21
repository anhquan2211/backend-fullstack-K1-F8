module.exports = {
  index: (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");

    if (error[0] === "Missing credentials") {
      error[0] = "Vui lòng điền đầy đủ thông tin";
    }
    return res.render("login/index", { error, success });
  },
  handleLogin: (req, res) => {
    return res.redirect("/");
  },

  loginGoogle: (req, res) => {
    return res.send("google");
  },
};
