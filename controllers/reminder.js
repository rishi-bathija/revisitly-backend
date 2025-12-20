import nodemailer from "nodemailer"
import dotenv from "dotenv"
import Bookmark from "../models/Bookmark.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
})


export const processReminderController = async (req, res) => {
  const secret = req.query.secret;
  if (!secret || secret !== process.env.REMINDER_SECRET) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }
  try {
    const now = new Date();

    const bookmarksToRemind = await Bookmark.find({
      remindAt: { $lte: now },
      reminded: false
    }).populate("user");

    for (const bookmark of bookmarksToRemind) {
      const user = bookmark.user;

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: "⏰ Reminder: Check your bookmark!",
        html: `
              <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px; border-radius:10px; max-width:600px; margin:auto;">
                <h2 style="color:#111827;">🔖 Reminder for your bookmark</h2>
                <p style="font-size:16px; color:#374151;">
                  Hey ${user.name || "there"},<br/><br/>
                  You saved this bookmark:
                </p>
                <div style="background:#fff; border:1px solid #e5e7eb; border-radius:8px; padding:15px; margin:20px 0;">
                  <strong>${bookmark.title || bookmark.url}</strong><br/>
                  <a href="${bookmark.url}" style="color:#2563eb; text-decoration:none;" target="_blank">
                    ${bookmark.url}
                  </a>
                </div>

                <p style="font-size:15px; color:#374151;">
                  Do you want to be reminded about this again later?
                </p>

                <a href="http://localhost:3000/add-bookmark?id=${bookmark._id}&mode=remind" 
                  style="display:inline-block; padding:12px 20px; background:#2563eb; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;">
                  🔄 Set Reminder Again
                </a>

                <p style="font-size:12px; color:#6b7280; margin-top:30px;">
                  — Your Bookmark Reminder App
                </p>
              </div>
              `
      });


      bookmark.reminded = true;
      await bookmark.save();

      console.log(`📬 Reminder sent to ${user.email} for ${bookmark.url}`);
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${bookmarksToRemind.length} reminders.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to process reminders.",
    });
  }
}
