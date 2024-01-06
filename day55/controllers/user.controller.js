const userModel = require("../models/user.model");
const moment = require("moment");
const { object, string } = require("yup");
module.exports = {
  index: async (req, res) => {
    const { status, keyword } = req.query;
    let statusBool;
    if (status === "active" || status === "inactive") {
      statusBool = status === "active" ? true : false;
    }

    //Đọc dữ liệu từ database
    const users = await userModel.all(statusBool, keyword);
    const msg = req.flash("msg");

    res.render("users/index", { users, moment, status, keyword, msg });
  },

  add: (req, res) => {
    // const errors = req.flash("errors");

    res.render("users/add", { req });
  },

  handleAdd: async (req, res) => {
    const schema = object({
      name: string().required("Tên bắt buộc phải nhập"),
      email: string()
        .required("Email bắt buộc phải nhập")
        .email("Email không đúng định dạng")
        .test("unique", "Email đã tồn tại trên hệ thống", async (value) => {
          const isUnique = await userModel.emailUnique(value);
          return isUnique;
        }),
    });
    try {
      const body = await schema.validate(req.body, { abortEarly: false });

      body.status = body.status === "1" ? true : false;

      await userModel.create(body);

      req.flash("msg", "Thêm người dùng thành công");

      return res.redirect("/users");
    } catch (e) {
      if (e?.inner) {
        const errors = Object.fromEntries(
          e.inner.map((item) => [item.path, item.message])
        );
        req.flash("errors", errors);
      }
      req.flash("old", req.body);
    }

    return res.redirect("/users/add");
  },

  edit: async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).send("User not found");
      }

      const emailErrors = req.flash("emailErrors");

      const emailErrorsText = emailErrors[0];

      console.log(req);

      res.render("users/edit", { req, user, emailErrorsText });
    } catch (error) {
      return res.status(500).send("Error fetching user details");
    }
  },

  handleEdit: async (req, res) => {
    const schema = object({
      name: string().required("Tên bắt buộc phải nhập"),
      email: string()
        .required("Email bắt buộc phải nhập")
        .email("Email không đúng định dạng"),
    });
    const userId = req.params.id;
    try {
      const { name, email, status } = req.body;

      await schema.validate({ name, email }, { abortEarly: false });

      const existingUser = await userModel.findById(userId);

      if (!existingUser) {
        return res.status(404).send("User not found");
      }

      //Nếu email không thay đổi gì thì vẫn cập nhật như bình thường.
      if (existingUser.email === email) {
        await userModel.update(userId, { name, email, status });
      } else {
        //Check email đã tồn tại trong hệ thống nếu user sửa email đã có trong hệ thống.
        const isEmailUnique = await userModel.checkEmail(email, userId);

        if (!isEmailUnique) {
          req.flash("emailErrors", { email: "Email đã được sử dụng" });

          return res.redirect(`/users/edit/${userId}`);
        }
        //Nếu email đã thay đổi và không trùng với email nào trong db thì cập nhật.
        await userModel.update(userId, { name, email, status });
      }

      req.flash("msg", "Sửa người dùng thành công");

      return res.redirect("/users");
    } catch (e) {
      if (e?.inner) {
        const errors = Object.fromEntries(
          e.inner.map((item) => [item.path, item.message])
        );
        req.flash("errors", errors);
      }
      req.flash("old", req.body);
      return res.redirect(`/users/edit/${userId}`);
    }
  },

  destroy: async (req, res) => {
    const userId = req.params.id;

    try {
      const existingUser = await userModel.findById(userId);
      if (!existingUser) {
        return res.status(404).send("User not found");
      }

      await userModel.delete(userId);

      req.flash("msg", "Xoá người dùng thành công");

      return res.redirect("/users");
    } catch (error) {
      return res.status(500).send("Error deleting user");
    }
  },
};
