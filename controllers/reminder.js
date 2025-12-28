import dotenv from "dotenv"
import jwt from "jsonwebtoken";
import Bookmark from "../models/Bookmark.js";
import { sendEmail } from "../services/emailService.js";
dotenv.config();

// Email template matching the Revisitly design
// Email template matching the Revisitly design - Mobile Responsive
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const emailTemplate = (user, bookmark, bookmarkUrl, remindAgainLink, frontendUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    @media only screen and (max-width: 600px) {
      .mobile-padding {
        padding: 20px 16px !important;
      }
      .mobile-text {
        font-size: 14px !important;
        line-height: 20px !important;
      }
      .mobile-heading {
        font-size: 18px !important;
        line-height: 24px !important;
      }
      .mobile-stack {
        display: block !important;
        width: 100% !important;
      }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td style="padding: 20px 8px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          
          <!-- Header with Logo -->
          <tr>
            <td class="mobile-padding" style="padding: 24px 24px 20px; background-color: #ffffff;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="vertical-align: middle; padding-bottom: 12px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 40px; height: 40px; background-color: #EFFCF6; border-radius: 8px; text-align: center; vertical-align: middle; line-height: 0;">
                          <img src="https://res.cloudinary.com/${cloudName}/image/upload/v1766914205/bookmark-blue_c6yuiv.png" alt="Revisitly" width="24" height="24" style="display: block; border: 0; margin: 0 auto;">
                        </td>
                        <td style="padding-left: 12px; vertical-align: middle;">
                          <div style="font-size: 16px; font-weight: 600; color: #1a1a1a; line-height: 1.3;">Revisitly</div>
                          <div style="font-size: 12px; color: #666666; line-height: 1.3;">Smart bookmark reminders</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: left;">
                    <span style="display: inline-block; padding: 6px 12px; background-color: #e8f5e9; color: #2e7d32; font-size: 11px; font-weight: 500; border-radius: 4px;">
                      Reminder email
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Title Section -->
          <tr>
            <td class="mobile-padding" style="padding: 0 24px 16px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="width: 36px; vertical-align: top; padding-top: 4px;">
                    <div style="width: 32px; height: 32px; background-color: #FEF3C7; border-radius: 50%; text-align: center; line-height: 32px;">
                      <img src="https://res.cloudinary.com/${cloudName}/image/upload/v1766914205/lucide_pin_tuik6j.png" alt="Bookmark" width="18" height="18" style="display: inline-block; vertical-align: middle; border: 0;">
                    </div>
                  </td>
                  <td style="padding-left: 12px; vertical-align: top;">
                    <h1 class="mobile-heading" style="margin: 0; font-size: 20px; font-weight: 600; color: #1a1a1a; line-height: 28px;">
                      Reminder for your bookmark
                    </h1>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #666666; line-height: 18px;">
                      It's time to revisit a link you saved in Revisitly.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td class="mobile-padding" style="padding: 0 24px 24px;">
              <p class="mobile-text" style="margin: 0 0 16px; font-size: 15px; line-height: 22px; color: #1a1a1a;">
                Hey ${user.name || 'there'},
              </p>
              <p class="mobile-text" style="margin: 0 0 20px; font-size: 15px; line-height: 22px; color: #4d4d4d;">
                You saved this bookmark and set a reminder to come back to it. Here's a quick snapshot to it.
              </p>
              
              <!-- Saved Bookmark heading -->
              <div style="margin: 0 0 8px; font-size: 11px; font-weight: 600; color: #808080; text-transform: uppercase; letter-spacing: 0.5px;">
                SAVED BOOKMARK
              </div>

              <!-- Bookmark Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px; background-color: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px;">
                    <h2 style="margin: 0 0 8px; font-size: 15px; font-weight: 600; color: #1a1a1a; line-height: 22px;">
                      ${bookmark.title || 'Untitled Bookmark'}
                    </h2>
                    <div style="margin-bottom: 4px; font-size: 10px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.5px;">
                      LINK
                    </div>
                    <a href="${bookmarkUrl}" style="display: block; color: #1976d2; text-decoration: none; font-size: 13px; line-height: 18px; word-break: break-all; margin-bottom: ${bookmark.tag && bookmark.tag.length > 0 ? '12px' : '0'};">
                      ${bookmarkUrl}
                    </a>
                    ${bookmark.tag && bookmark.tag.length > 0 ? `
                    <div style="margin-top: 12px;">
                      <div style="margin-bottom: 6px; font-size: 10px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.5px;">
                        TAGS
                      </div>
                      ${bookmark.tag.map(tag => `
                        <span style="display: inline-block; background-color: #e3f2fd; color: #1565c0; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 500; margin: 0 6px 6px 0;">
                          ${tag}
                        </span>
                      `).join('')}
                    </div>
                    ` : ''}
                  </td>
                </tr>
              </table>
              
              <!-- Reminder Metadata -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td style="font-size: 12px; color: #666666; padding-bottom: 6px; vertical-align: top;">
                    Reminder Scheduled for<br>
                    <strong style="color: #1a1a1a;">${new Date(bookmark.remindAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                  </td>
                  <td style="text-align: right; font-size: 12px; color: #666666; padding-bottom: 6px; vertical-align: top;">
                    Bookmark created<br>
                    <strong style="color: #1a1a1a;">${new Date(bookmark.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Buttons -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 10px;">
                    <a href="${bookmarkUrl}" style="display: block; width: 100%; padding: 13px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; text-align: center; font-size: 14px; font-weight: 600; border-radius: 6px; box-sizing: border-box;">
                      <img src="https://res.cloudinary.com/${cloudName}/image/upload/v1766915956/lucide_link_ova1oz.png" alt="" width="16" height="16" style="display: inline-block; vertical-align: middle; margin-right: 6px; margin-top: -2px; border: 0;">
                      <span style="vertical-align: middle;">Visit bookmark</span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <a href="${remindAgainLink}" style="display: block; width: 100%; padding: 13px 20px; background-color: #F3F4F6; color: #1a1a1a; text-decoration: none; text-align: center; font-size: 14px; font-weight: 600; border-radius: 6px; border: 1px solid #d0d0d0; box-sizing: border-box;">
                      <img src="https://res.cloudinary.com/${cloudName}/image/upload/v1766916207/lucide_refresh-cw_qkzu2z.png" alt="" width="16" height="16" style="display: inline-block; vertical-align: middle; margin-right: 6px; margin-top: -2px; border: 0;">
                      <span style="vertical-align: middle;">Remind me again later</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="mobile-padding" style="padding: 20px 24px 24px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 8px; font-size: 12px; line-height: 18px; color: #666666;">
                You're receiving this because you set a reminder for this bookmark.
              </p>
              <p style="margin: 0 0 12px; font-size: 12px; line-height: 18px; color: #666666;">
                To change future reminders, go to: 
                <a href="${frontendUrl}/dashboard" style="color: #1976d2; text-decoration: none; font-weight: 500;">
                  Manage your bookmarks
                </a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #999999;">
                Revisitly — Your bookmark reminder app
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

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
        // Generate a signed token for this specific bookmark's reminder link
        const reminderToken = jwt.sign(
          {
            action: "REMIND",
            bookmarkId: bookmark._id.toString(),
            userId: user._id.toString()
          },
          process.env.REMINDER_TOKEN_SECRET,
          { expiresIn: "24h" } // Token valid for 24 hours
        );

        const remindAgainLink = `${frontendUrl}/remind/${reminderToken}`;

        await sendEmail({
          to: user.email,
          subject: `⏰ Reminder: Check your bookmark!`,
          html: emailTemplate(user, bookmark, bookmark.url, remindAgainLink, frontendUrl),
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
