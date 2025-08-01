import nodemailer from "nodemailer"
import dotenv from "dotenv"
import Bookmark from "../models/Bookmark.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: true,
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
                html: `<p>Hey there! Here's a bookmark you saved: <a href="${bookmark.url}">${bookmark.title || bookmark.url}</a></p>`
            })

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