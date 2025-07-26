import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    firebaseUID: {
        type: String,
        unique: true,
        sparse: true
    },
    token: {
        type: String
    }
}, {
    timestamps: true,
})

export default mongoose.model("user", userSchema);