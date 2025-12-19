import Bookmark from "../models/Bookmark.js";


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