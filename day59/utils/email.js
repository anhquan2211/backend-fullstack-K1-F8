const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = async (to, subject, message, emailId) => {
  const trackingPixelUrl = `https://day59-eight.vercel.app/open-mail?id=${emailId}`;
  // const trackingPixelUrl = `https://7t72z6-3000.csb.app/open-mail`;

  const html = `
    <html>
      <body>
        <div>${message}</div>
        <img src="${trackingPixelUrl}" style="width:1px; height:1px">
      </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: `"Anh Quan Dev" <${process.env.MAIL_FROM}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });
  return info;
};

module.exports = sendMail;
