import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import admin from "../firebase.js"
dotenv.config();

export const signupController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        })
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword
        })

        return res.status(200).json({
            success: true,
            message: "User registed successfully",
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Can't register user. Please try again",
        })
    }
}

export const loginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        })
    }

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signup first",
            })
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            user.token = token;
            user.password = undefined;

            return res.status(200).json({
                success: true,
                message: "Logged in successfully",
                token
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Password incorrect",
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login, please try again",
        })
    }
}

export const socialLoginController = async (req, res) => {
    try {
        console.log('req.body:', req.body);
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ success: false, message: "No ID token provided" });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        let user = await User.findOne({ firebaseUID: uid });

        if (!user) {
            user = await User.create({
                firebaseUID: uid,
                email
            })
        }

        return res.status(200).json({
            success: true,
            meessage: "Social login successfull",
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            successs: false,
            message: "Social Login failed",
        })
    }
}