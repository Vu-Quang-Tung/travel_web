const nodemailer = require("nodemailer");

function hasMailConfig() {
  return Boolean(process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS);
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
}

/* Gui email neu da cau hinh SMTP; local demo se in link ra console */
async function sendActionEmail({ to, subject, text, actionUrl }) {
  if (!hasMailConfig()) {
    console.log(`[mail:dev] ${subject} for ${to}: ${actionUrl}`);
    return;
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject,
    text: `${text}\n\n${actionUrl}`,
    html: `<p>${text}</p><p><a href="${actionUrl}">${actionUrl}</a></p>`,
  });
}

module.exports = {
  sendActionEmail,
};
