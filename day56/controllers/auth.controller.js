const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const { User, Device } = require("../models");
const { object, string, ref } = require("yup");
const useragent = require("useragent");
const validate = require("../utils/validate");

module.exports = {
  index: async (req, res) => {
    try {
      const failed = req.flash("failed");
      const success = req.flash("success");
      const msg = req.flash("msg");

      return res.render("login/index", { failed, req, success, msg });
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

    const { email, password, platform } = req.body;

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
        req.session.userInfor = user;
        req.session.userId = user.dataValues.id;

        const token = uuidv4();

        const userAgentInfo = useragent.parse(req.headers["user-agent"]);

        // Check if the device already exists
        const existingDevices = await Device.findAll({
          where: { user_id: user.id, status: true },
        });

        if (existingDevices && existingDevices.length > 0) {
          let tokenMatch = false;

          // Update all existing devices
          for (const existingDevice of existingDevices) {
            if (existingDevice.token === token) {
              // Token matches, update the existing device
              await Device.update(
                {
                  last_active: new Date(),
                  status: true,
                },
                { where: { id: existingDevice.id } }
              );

              tokenMatch = true;
              break;
            }
          }

          // If no matching token found, create a new device
          if (!tokenMatch) {
            await Device.create({
              name: platform,
              browser: userAgentInfo.source,
              user_id: user.id,
              time_login: new Date(),
              last_active: new Date(),
              token,
              status: true,
            });
          }
        } else {
          // Create a new record for the current device
          await Device.create({
            name: platform,
            browser: userAgentInfo.source,
            user_id: user.id,
            time_login: new Date(),
            last_active: new Date(),
            token,
            status: true,
          });
        }

        req.session.deviceToken = token;
        res.cookie("__Secure_token", token, { httpOnly: true });
        req.flash("success", "Đăng nhập thành công");
        return res.redirect("/");
      } else {
        console.log(1111);
        req.flash("failed", "Email hoặc mật khẩu không chính xác!");
        req.flash("old", req.body);
        return res.redirect("/auth/login");
      }
    } catch (e) {
      console.log("hahahahahahaha", e);
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
  },

  logout: async (req, res) => {
    const { userLogin, deviceToken } = req.session;

    if (!userLogin) {
      return res.redirect("/auth/login");
    }

    // Update the device status to false
    await Device.update(
      { status: false },
      { where: { user_id: userLogin.id, token: deviceToken } }
    );

    // Clear session and cookie
    delete req.session.userLogin;
    delete req.session.login;
    delete req.session.userInfor;
    delete req.session.userId;
    delete req.session.deviceToken;

    req.flash("success", "Đăng xuất thành công");
    return res.redirect("/auth/login");
  },
};
