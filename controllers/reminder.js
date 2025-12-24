import dotenv from "dotenv"
import Bookmark from "../models/Bookmark.js";
import { sendEmail } from "../services/emailService.js";
dotenv.config();

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

    console.log(`Found ${bookmarksToRemind.length} bookmarks to remind`);
    console.log('Bookmarks:', bookmarksToRemind);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    let sentCount = 0;
    let failedCount = 0;

    for (const bookmark of bookmarksToRemind) {
      const user = bookmark.user;
      console.log('user', user);
      console.log('bookmark', bookmark);

      // await transporter.sendMail({
      //   from: process.env.MAIL_USER,
      //   to: user.email,
      //   subject: "⏰ Reminder: Check your bookmark!",
      //   html: `
      //         <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px; border-radius:10px; max-width:600px; margin:auto;">
      //           <h2 style="color:#111827;">🔖 Reminder for your bookmark</h2>
      //           <p style="font-size:16px; color:#374151;">
      //             Hey ${user.name || "there"},<br/><br/>
      //             You saved this bookmark:
      //           </p>
      //           <div style="background:#fff; border:1px solid #e5e7eb; border-radius:8px; padding:15px; margin:20px 0;">
      //             <strong>${bookmark.title || bookmark.url}</strong><br/>
      //             <a href="${bookmark.url}" style="color:#2563eb; text-decoration:none;" target="_blank">
      //               ${bookmark.url}
      //             </a>
      //           </div>

      //           <p style="font-size:15px; color:#374151;">
      //             Do you want to be reminded about this again later?
      //           </p>

      //           <a href="http://localhost:3000/add-bookmark?id=${bookmark._id}&mode=remind" 
      //             style="display:inline-block; padding:12px 20px; background:#2563eb; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;">
      //             🔄 Set Reminder Again
      //           </a>

      //           <p style="font-size:12px; color:#6b7280; margin-top:30px;">
      //             Revisitly — Your Bookmark Reminder App
      //           </p>
      //         </div>
      //         `
      // });

      try {
        await sendEmail({
          to: user.email,
          subject: `⏰ Reminder: Check your bookmark!`,
          html: `
            <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px; border-radius:10px; max-width:600px; margin:auto;">
              <h2 style="color:#111827;">🔖 Reminder for your bookmark</h2>
              <p style="font-size:16px; color:#374151;">
                Hey ${user.name || "there"},<br/><br/>
                You saved this bookmark and set a reminder:
              </p>
              <div style="background:#fff; border:1px solid #e5e7eb; border-radius:8px; padding:15px; margin:20px 0;">
                <strong style="color:#111827; font-size:18px;">${bookmark.title || 'Untitled'}</strong><br/><br/>
                <a href="${bookmark.url}" style="color:#2563eb; text-decoration:none; word-break: break-all;" target="_blank">
                  ${bookmark.url}
                </a>
                ${bookmark.tag && bookmark.tag.length > 0 ? `
                  <div style="margin-top:10px;">
                    ${bookmark.tag.map(tag => `<span style="background:#dbeafe; color:#1e40af; padding:4px 8px; border-radius:12px; font-size:12px; margin-right:5px;">${tag}</span>`).join('')}
                  </div>
                ` : ''}
              </div>

              <div style="margin:20px 0;">
                <a href="${bookmark.url}" 
                  style="display:inline-block; padding:12px 24px; background:#10b981; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold; margin-right:10px;">
                  🔗 Visit Bookmark
                </a>
                <a href="${frontendUrl}/add-bookmark?id=${bookmark._id}&mode=remind" 
                  style="display:inline-block; padding:12px 24px; background:#2563eb; color:#fff; border-radius:6px; text-decoration:none; font-weight:bold;">
                  🔄 Remind Again
                </a>
              </div>

              <p style="font-size:14px; color:#6b7280; margin-top:30px; border-top:1px solid #e5e7eb; padding-top:15px;">
                You're receiving this because you set a reminder for this bookmark.<br/>
                <a href="${frontendUrl}/dashboard" style="color:#2563eb;">Manage your bookmarks</a>
              </p>
              
              <p style="font-size:12px; color:#9ca3af; margin-top:10px;">
                Revisitly — Your Bookmark Reminder App
              </p>
            </div>
          `
        });

        bookmark.reminded = true;
        await bookmark.save();

        sentCount++;
        console.log(`📬 Reminder sent to ${user.email} for ${bookmark.url}`);
      } catch (error) {
        failedCount++;
        console.error(`error sending mail for bookmark ${bookmark.id}`, error.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${bookmarksToRemind.length} reminders.`,
      sent: sentCount,
      failed: failedCount
    });
  } catch (error) {
    console.error("Reminder job crashed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process reminders.",
    });
  }
}
