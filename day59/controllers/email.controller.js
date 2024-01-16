const nodemailer = require("nodemailer");
const moment = require("moment");

const model = require("../models/index");
const sendEmail = require("../utils/email");

const email = model.email;

module.exports = {
  index: async (req, res) => {
    const msg = req.flash("msg");

    return res.render("email/index", { msg });
  },

  handleSendEmail: async (req, res, next) => {
    const { emailSendTo, subject, message } = req.body;

    try {
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
    } catch (error) {
      console.log(error);
      return next(error);
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

    emails.sort((a, b) => a.sent_time - b.sent_time);

    return res.render("email/history", {
      data,
      moment,
      emails,
      totalPage,
      page,
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
};
