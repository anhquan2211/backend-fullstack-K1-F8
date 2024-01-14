module.exports = async (req, res, next) => {
  const { userLogin } = req.session;

  console.log("userLogin: ", userLogin);

  if (userLogin) {
    console.log("guestMD");
    return res.redirect("/");
  }

  next();
};
