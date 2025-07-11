import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
        required: true,
        unique: true
    },
    token: {
        type: String
    }
}, {
    timestamps: true,
})

export default mongoose.model("user", userSchema);