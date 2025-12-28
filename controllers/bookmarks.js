import Bookmark from "../models/Bookmark.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const addBookmarkController = async (req, res) => {
    const { url, title, tag, remindAt } = req.body;

    if (!url) {
        return res.status(400).json({
            success: false,
            message: "URL is required",
        })
    }

    try {
        const newBookmark = await Bookmark.create({
            user: req.userId,
            url,
            title,
            tag,
            remindAt: remindAt ? new Date(remindAt) : null
        })

        return res.status(200).json({
            success: true,
            message: "Bookmark created",
            newBookmark
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Can't save bookmark. Please try again",
        })
    }
}

export const updateBookmarkController = async (req, res) => {
    const bookmarkData = req.body;
    const { id } = req.params;

    try {
        // Create update object based on what's provided
        const updateFields = {};

        if (bookmarkData.url) updateFields.url = bookmarkData.url;
        if (bookmarkData.title !== undefined) updateFields.title = bookmarkData.title;
        if (bookmarkData.tag !== undefined) updateFields.tag = bookmarkData.tag;
        if (bookmarkData.remindAt !== undefined) {
            updateFields.remindAt = bookmarkData.remindAt ? new Date(bookmarkData.remindAt) : null;
            updateFields.reminded = false; // Reset reminded status when updating reminder
        }

        const updatedBookmark = await Bookmark.findOneAndUpdate(
            { _id: id, user: req.userId },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedBookmark) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Bookmark updated successfully!",
            updatedBookmark
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Can't update bookmark",
        });
    }
};

export const emailReminderController = async (req, res) => {
    try {
        const { token, remindAt } = req.body;

        if (!token || !remindAt) {
            return res.status(400).json({ success: false, message: "Missing token or remindAt" });
        }

        const secret = process.env.REMINDER_TOKEN_SECRET;
        const payload = jwt.verify(token, secret);

        if (payload.action !== "REMIND") {
            return res.status(403).json({ success: false, message: "Invalid token action" });
        }

        // Ensure the bookmark exists and belongs to payload.userId
        const updated = await Bookmark.findOneAndUpdate(
            { _id: payload.bookmarkId, user: payload.userId },
            { remindAt: new Date(remindAt), reminded: false },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }

        return res.json({ success: true, updatedBookmark: updated });
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired reminder link",
        });
    }
};

export const verifyReminderTokenController = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: "Token required" });
        }

        const payload = jwt.verify(token, process.env.REMINDER_TOKEN_SECRET);
        if (payload.action !== "REMIND") {
            return res.status(403).json({ success: false, message: "Invalid token action" });
        }

        const bookmark = await Bookmark.findById(payload.bookmarkId).populate("user", "email");
        if (!bookmark) {
            return res.status(404).json({ success: false, message: "Bookmark not found" });
        }

        const ownerEmail = bookmark.user?.email || null;
        return res.json({
            success: true,
            bookmarkId: payload.bookmarkId,
            ownerId: payload.userId,
            ownerEmail
        });
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export const getBookmarkController = async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ user: req.userId }).sort({ createdAt: -1 });
        return res.json({
            success: true,
            message: "Bookmarks fetched",
            bookmarks
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookmarks, please try again",
        })
    }
}

export const deleteBookmarkController = async (req, res) => {
    try {
        const bookmark = await Bookmark.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        })

        console.log('bookmark', bookmark);

        return res.status(200).json({
            success: true,

            message: "Bookmark deleted",
        })
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            successs: false,
            message: "Failed to delete bookmark",
        })
    }
}


export const getSingleBookmarkController = async (req, res) => {
    const { id } = req.params;
    try {
        const bookmark = await Bookmark.findOne({ _id: id, user: req.userId });
        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found or you don't have access to it",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Bookmark fetched successfully",
            bookmark
        });
    } catch (error) {
        console.log("Error fetching bookmark:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookmark",
        });
    }
}