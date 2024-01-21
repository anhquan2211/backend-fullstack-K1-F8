module.exports = (req, res, next) => {
  const pathname = req.baseUrl;
  console.log(pathname);

  if (!req.user || pathname === "/logout") {
    console.log("ignore logout");
    return next();
  }
  console.log("do not ignore");
  return res.redirect("/");
};
