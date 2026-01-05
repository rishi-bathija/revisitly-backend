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
    },

    repeatType: {
        type: String,
        enum: ["none", "daily", "weekly"],
        default: "none"
    },

    smartFollowUp: {
        enabled: {
            type: Boolean,
            default: false
        },
        daysDelay: {
            type: Number,
            default: 3
        },
        lastOpened: {
            type: Date,
            default: null
        },
        followUpScheduled: {
            type: Date,
            default: null
        },
        followUpSent: {
            type: Boolean,
            default: false
        }
    },

    reminderHistory: [
        {
            sentAt: {
                type: Date,
                default: Date.now
            },
            // method: {
            //     type: String,
            //     enum: ["email", "push"],
            //     default: "email"
            // },
            opened: {
                type: Boolean,
                default: false
            },
            isFollowUp: {
                type: Boolean,
                default: false
            }
        }
    ]
}, { timestamps: true })

export default mongoose.model("bookmark", bookmarkSchema);