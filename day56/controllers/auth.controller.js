const bcrypt = require("bcrypt");

const { User } = require("../models");
const { object, string, ref } = require("yup");
const validate = require("../utils/validate");

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
      const msg = req.flash("msg");

      res.render("login/index", { failed, req, success, msg });
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
        req.session.login = true;
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

  register: (req, res) => {
    // const errors = req.flash("errors");
    // const msg = req.flash("msg");
    // const exist = req.flash("checkEmail");
    // const old = req.flash("old");
    const login = req.session.login;
    const failed = req.flash("failed");
    const success = req.flash("success");
    if (!login) {
      return res.render("register/index", { failed, req, success });
    } else {
      return res.redirect("/users");
    }
  },

  handleRegister: async (req, res) => {
    const schema = object({
      name: string().required("Tên bắt buộc phải nhập"),
      email: string()
        .required("Email bắt buộc phải nhập")
        .email("Email không đúng định dạng"),

      password: string()
        .required("Mật khẩu bắt buộc phải nhập")
        .min(6, "Mật khẩu phải tối thiểu 6 ký tự")
        .matches(/[a-zA-Z]/, "Mật khẩu cần có ít nhất một ký tự là chữ"),

      passwordRepeat: string().oneOf(
        [ref("password")],
        "Mật khẩu chưa trùng khớp"
      ),
    });
    const { name, email, password, passwordRepeat } = req.body;
    try {
      const body = await schema.validate(req.body, { abortEarly: false });
      const userExist = await User.findOne({ where: { email } });

      if (!userExist) {
        if (password === passwordRepeat) {
          const saltRounds = 10;
          const hash = await bcrypt.hash(password, saltRounds);
          await User.create({
            name,
            email,
            password: hash,
          });
          req.flash("msg", "Đăng ký thành công");
          return res.redirect("/auth/login");
        } else {
          req.flash("errors", { password: "Mật khẩu không khớp" });
          req.flash("old", req.body);
          return res.redirect("/auth/register");
        }
      } else {
        req.flash("errors", { email: "Email đã tồn tại trong hệ thống" });
        req.flash("old", req.body);
      }
    } catch (e) {
      const errors = Object.fromEntries(
        e?.inner.map((item) => [item.path, item.message])
      );
      req.flash("errors", errors);
      // req.flash("failed", "Vui lòng nhập đầy đủ thông tin");
      req.flash("old", req.body);
    }
    return res.redirect("/auth/register");
    // const result = validationResult(req);
    // if (result.isEmpty()) {
    //   const { name, email, password, status } = req.body;
    //   const userExist = await User.findOne({ where: { email } });
    //   if (userExist === null) {
    //     const saltRounds = 10;
    //     bcrypt.hash(password, saltRounds, async function (err, hash) {
    //       try {
    //         await User.create({
    //           name,
    //           email,
    //           password: hash,
    //           status: status === "active",
    //         });
    //       } catch (error) {
    //         console.log(error);
    //       }
    //     });
    //     req.flash("msg", "Đăng kí thành công");
    //     return res.redirect("auth/login");
    //   } else {
    //     req.flash("old", req.body);
    //     req.flash("checkEmail", "Email đã tồn tại!");
    //     return res.redirect("auth/register");
    //   }
    // }
    // req.flash("old", req.body);
    // req.flash("errors", result.errors);
    // req.flash("msg", "Đăng kí thất bại");
    // return res.redirect("/register");
  },

  logout: async (req, res) => {
    // delete req.session.userLogin;
    // console.log(req.session.userLogin);

    // req.flash("success", "Đăng xuất thành công");
    // return res.redirect("/auth/login");

    delete req.session.userLogin;
    delete req.session.login;
    req.flash("success", "Đăng xuất thành công");
    return res.redirect("/auth/login");
  },
};
