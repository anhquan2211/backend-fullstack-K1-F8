module.exports = (req, res, next) => {
  const { userLogin } = req.session;

  if (!userLogin) {
    return res.redirect("/auth/login");
  }
  next();
};
