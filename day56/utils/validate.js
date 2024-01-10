const { check } = require("express-validator");
module.exports = {
  register: () => {
    return [
      check("name", "Vui lòng nhập trường này!").notEmpty(),
      check("email", "Vui lòng nhập đúng định dạng email!").isEmail(),
      check("password", "Mật khẩu phải có ít nhất 6 kí tự").isLength({
        min: 6,
      }),
    ];
  },
  getError: (errors, field) => {
    const err = errors.find((e) => e.path === field);
    if (err) {
      return err.msg;
    }
  },
};
