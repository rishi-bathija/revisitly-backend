import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  connectionTimeout: 20000,
});

export const sendWithSMTP = async ({ to, subject, html }) => {
  const response = await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  });

  return response;
};
