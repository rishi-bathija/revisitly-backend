import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
    tag: [
        {
            type: String
        }
    ],
    remindAt: {
        type: Date
    },
    reminded: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default mongoose.model("bookmark", bookmarkSchema);