const nodemailer = require("nodemailer");
const moment = require("moment");
const { string, object } = require("yup");

const model = require("../models/index");
const sendEmail = require("../utils/email");

const email = model.email;

module.exports = {
  index: async (req, res) => {
    const msg = req.flash("msg");
    const failed = req.flash("failed");

    return res.render("email/index", { msg, failed, req });
  },

  handleSendEmail: async (req, res, next) => {
    const { emailSendTo, subject, message } = req.body;

    const schema = object({
      emailSendTo: string()
        .required("Email bắt buộc phải nhập")
        .email("Email không đúng định dạng"),
      subject: string().required("Tiêu đề bắt buộc phải nhập"),
      message: string().required("Lời nhắn bắt buộc phải nhập"),
    });

    try {
      const body = await schema.validate(req.body, { abortEarly: false });
      const sentEmail = await email.create({
        email_to: emailSendTo,
        subject: subject,
        message: message,
        status: false,
        sent_time: new Date(),
      });

      const info = await sendEmail(emailSendTo, subject, message, sentEmail.id);

      if (!info?.accepted?.length) {
        throw new Error("Lỗi khi gửi email");
      }
      console.log("Send email successfull! ");
      req.flash("msg", "Send email successfull!");
      return res.redirect("/send-email");
    } catch (e) {
      console.log(e);
      const errors = Object.fromEntries(
        e?.inner.map((item) => [item.path, item.message])
      );
      req.flash("errors", errors);
      req.flash("failed", "Vui lòng kiểm tra lại thông tin đã nhập!");
      req.flash("old", req.body);
      return res.redirect("/send-email");
    }
  },

  history: async (req, res) => {
    const data = await email.findAll();

    data.sort((a, b) => b.sent_time - a.sent_time);

    const limit = 6;
    const { page = 1 } = req.query;

    const offset = (page - 1) * limit;

    const { rows: emails, count } = await email.findAndCountAll({
      order: [["sent_time", "desc"]],
      limit,
      offset,
    });

    const totalPage = Math.ceil(count / limit);

    // emails.sort((a, b) => a.sent_time - b.sent_time);

    const msg = req.flash("msg");

    return res.render("email/history", {
      data,
      moment,
      emails,
      totalPage,
      page,
      msg,
    });
  },

  historyDetail: async (req, res, next) => {
    try {
      const data = await email.findByPk(req.params.id);

      return res.render("email/detail", { data, moment });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  destroy: async (req, res) => {
    const emailId = req.params.id;

    try {
      const existingEmail = await email.findByPk(emailId);

      console.log(existingEmail);

      if (!existingEmail) {
        return res.status(400).send("Email not found");
      }

      await existingEmail.destroy();

      req.flash("msg", "Xoá email thành công!");
      return res.redirect("/send-email/history");
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error deleting email");
    }
  },
};
