const bcrypt = require("bcrypt");

const { User } = require("../models");
const { object, string } = require("yup");

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

module.exports = {
  index: async (req, res) => {
    try {
      //   const hashedPassword = await hashPassword("12345678");

      //Tạo mới user vào db
      //   await User.create({
      //     name: "Quoc Anh",
      //     email: "quocanh@gmail.com",
      //     password: hashedPassword,
      //   });

      //   res.send("User created successfully");
      const failed = req.flash("failed");
      const success = req.flash("success");

      res.render("auth/login", { failed, req, success });
    } catch (error) {
      //   console.error("Error creating user:", error);
      //   res.status(500).send("Error creating user");
    }
  },

  handleLogin: async (req, res) => {
    const schema = object({
      email: string()
        .required("Email bắt buộc phải nhập")
        .email("Email không đúng định dạng"),

      password: string().required("Mật khẩu bắt buộc phải nhập"),
    });

    const { email, password } = req.body;

    try {
      const body = await schema.validate(req.body, { abortEarly: false });
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        req.flash("failed", "Email hoặc mật khẩu không chính xác!");
        req.flash("old", req.body);
        return res.redirect("/auth/login");
      }

      // So sanh password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        //Successful login
        req.session.userLogin = user.dataValues;
        req.flash("success", "Đăng nhập thành công");
      } else {
        req.flash("failed", "Email hoặc mật khẩu không chính xác!");
        req.flash("old", req.body);
        return res.redirect("/auth/login");
      }
    } catch (e) {
      const errors = Object.fromEntries(
        e?.inner.map((item) => [item.path, item.message])
      );
      req.flash("errors", errors);
      req.flash("failed", "Vui lòng nhập đầy đủ thông tin");
      req.flash("old", req.body);
    }

    return res.redirect("/auth/login");
  },

  logout: async (req, res) => {
    // delete req.session.userLogin;
    // console.log(req.session.userLogin);

    // req.flash("success", "Đăng xuất thành công");
    // return res.redirect("/auth/login");

    delete req.session.userLogin;
    req.flash("success", "Đăng xuất thành công");
    return res.redirect("/auth/login");
  },
};
