const bcrypt = require("bcrypt");
const model = require("../models/index");
const { object, string, ref } = require("yup");
const { Op } = require("sequelize");

const User = model.User;
const Device = model.Device;

module.exports = {
  index: async (req, res) => {
    const { userInfor } = req.session;
    const success = req.flash("success");

    // Get the token from the cookie
    const userToken = req.cookies.__Secure_token;

    // Find the user in the database
    const user = await User.findByPk(userInfor.id);

    if (!user) {
      req.session.destroy();
      res.clearCookie("__Secure_token");
      return res.redirect("/auth/login");
    }

    // // Find devices associated with the user
    // const devices = await Device.findAll({
    //   where: { user_id: user.id },
    // });

    // // Check and update device statuses
    // for (const device of devices) {
    //   if (device.token === userToken) {
    //     // Set status to true for the device with the matching token
    //     await Device.update({ status: true }, { where: { id: device.id } });
    //   } else {
    //     // Set status to false for devices with different tokens
    //     await Device.update({ status: false }, { where: { id: device.id } });
    //   }
    // }

    return res.render("index", { userInfor, success });
  },

  info: (req, res) => {
    const userInfo = req.session.userInfor;
    const success = req.flash("success");
    const errors = req.flash("errors");
    const failed = req.flash("failed");

    return res.render("infor/index", {
      userInfo,
      req,
      success,
      errors,
      failed,
    });
  },

  handleInfo: async (req, res, next) => {
    const schema = object({
      name: string().required("Tên bắt buộc phải nhập"),
      email: string()
        .required("Email bắt buộc phải nhập")
        .email("Email không đúng định dạng"),
    });

    try {
      //Lấy id  của user từ session
      const { userId } = req.session;
      console.log("userId", userId);

      //Kiểm tra xem id và token có tồn tại hay không?
      if (!userId) {
        return res.redirect("/auth/login");
      }

      const device = await Device.findAll({
        where: { user_id: userId, status: true },
      });

      if (!device) {
        // Redirect to login if the device is not found or status is false
        return res.redirect("/auth/login");
      }

      const tokenFromDatabase = device.token;
      const tokenFromCookie = req.cookies.__Secure_token;

      //Nếu như 2 token không giống nhau, phòng trường hợp người dùng sửa token ở cookie thì chuyển về trang đăng nhập luôn.
      // if (tokenFromDatabase !== tokenFromCookie) {
      //   console.log("token not match");
      //   res.clearCookie("__Secure_token");

      //   return res.redirect("/auth/login");
      // }

      //Nếu như 2 token giống nhau thì cho cập nhật thông tin người dùng
      const { name, email } = req.body;

      const userExist = await User.findOne({
        where: {
          email,
          id: {
            [Op.ne]: userId, // Exclude the current user ID
          },
        },
      });

      if (userExist) {
        req.flash("failed", "Email đã tồn tại trong hệ thống!");
        return res.redirect("/users/info");
      }

      const body = await schema.validate(req.body, { abortEarly: false });
      const [status] = await User.update(
        { name, email },
        { where: { id: userId }, returning: true }
      );

      if (status) {
        const updatedUser = await User.findByPk(userId);

        req.session.userInfor = {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
        };

        req.flash("success", "Chỉnh sửa thông tin thành công");
        return res.redirect("/users/info");
      }
    } catch (e) {
      const errors = Object.fromEntries(
        e?.inner.map((item) => [item.path, item.message])
      );
      console.log(errors);
      req.flash("errors", errors);
      req.flash("old", req.body);
      return res.redirect("/users/info");
    }
  },

  password: (req, res) => {
    console.log("password");
    return res.render("password/index", { req });
  },

  handlePassword: async (req, res) => {
    const schema = object({
      password: string().required("Mật khẩu bắt buộc phải nhập"),

      newPassword: string()
        .required("Mật khẩu bắt buộc phải nhập")
        .min(6, "Mật khẩu phải tối thiểu 6 ký tự")
        .matches(/[a-zA-Z]/, "Mật khẩu cần có ít nhất một ký tự là chữ"),

      newPasswordRepeat: string().oneOf(
        [ref("newPassword")],
        "Mật khẩu chưa trùng khớp"
      ),
    });
    const { password, newPassword, newPasswordRepeat } = req.body;

    const userId = req.session.userId;

    try {
      const body = await schema.validate(req.body, { abortEarly: false });

      const user = await User.findByPk(userId);

      const tokenCookie = req.cookies.__Secure_token;
      console.log("tokenCookie: ", tokenCookie);

      const devices = await Device.findAll({
        where: { user_id: userId, status: true },
      });

      const tokenDeviceDatabase = devices.map((device) => device.token);
      console.log("tokenDeviceDatabase", tokenDeviceDatabase);

      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log("passwordMatch", passwordMatch);

      if (
        passwordMatch &&
        tokenDeviceDatabase.some((token) => tokenCookie.includes(token))
      ) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        await User.update(
          { password: hashedPassword },
          { where: { id: userId } }
        );

        // Set status to false for all devices
        await Device.update({ status: false }, { where: { user_id: userId } });

        delete req.session.userLogin;
        delete req.session.login;
        delete req.session.userInfor;
        delete req.session.userId;

        // res.clearCookie("__Secure_token");

        req.flash(
          "success",
          "Đổi mật khẩu thành công! Đã đăng xuất khỏi tất cả các thiết bị."
        );
        // req.session.destroy();
        return res.redirect("/auth/login");
      } else {
        // If the current password doesn't match, display an error
        req.flash("errors", { password: "Mật khẩu hiện tại không đúng" });
        return res.redirect("/users/password");
      }
    } catch (e) {
      console.log(e);
      const errors = Object.fromEntries(
        e?.inner?.map((item) => [item.path, item.message])
      );
      req.flash("errors", errors);
      req.flash("old", req.body);
      return res.redirect("/users/password");
    }
  },
};
