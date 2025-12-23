import { sendWithResend } from "./resendService.js";
import { sendWithSMTP } from "./smtpService.js";

export const sendEmail = async ({ to, subject, html }) => {
    const provider = process.env.EMAIL_PROVIDER || "resend";

    if (provider === "resend") {
        return await sendWithResend({ to, subject, html });
    }

    if (provider === "smtp") {
        return await sendWithSMTP({ to, subject, html });
    }

    throw new Error(`Unsupported email provider: ${provider}`);
};
