import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connected");
    } catch (error) {
        console.log("DB connection failed");
        console.log(error);
        process.exit(1);
    }
}

export default dbConnect