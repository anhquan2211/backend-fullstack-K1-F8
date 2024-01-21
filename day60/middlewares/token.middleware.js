const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { token } = req.params;

  try {
    var decoded = jwt.verify(token, "secret");
    if (decoded) {
      next();
    }
  } catch (err) {
    res.send("<h1>Link xác thực đã hết hạn hoặc không tồn tại</h1>");
  }
};
