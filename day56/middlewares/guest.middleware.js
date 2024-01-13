module.exports = async (req, res, next) => {
  const { userLogin } = req.session;

  if (userLogin) {
    return res.redirect("/");
  }

  next();
};
