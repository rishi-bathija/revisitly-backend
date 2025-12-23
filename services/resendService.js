import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWithResend = async ({ to, subject, html }) => {
  const response = await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (response.error) {
    throw new Error(`Failed to send email: ${response.error.message}`);
  }

  return response;
};
