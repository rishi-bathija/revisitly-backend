import admin from "../firebase.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // console.log('authheader', authHeader);

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }

        const token = authHeader.split('Bearer ')[1];
        // console.log('token', token);


        // console.log('token', token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            })
        }

        try {
            const decodedFirebaseToken = await admin.auth().verifyIdToken(token);
            req.user = decodedFirebaseToken;

            const user = await User.findOne({ firebaseUID: decodedFirebaseToken.uid });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found",
                })
            }
            req.userId = user._id;
            return next();
        } catch (firebaseError) {
            console.log('firebaseerror', firebaseError);
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log('decoded', decoded);
            const user = await User.findById( decoded.id );
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found",
                })
            }
            req.user = user;
            req.userId = user.id
            return next();
        } catch (jwtError) {
            console.log('jwtError', jwtError);
            return res.status(401).json({ message: "Token invalid" });
        }
    } catch (error) {
        return res.status(401).json({
            successs: false,
            message: "Something went wrong while validating the token",
        })

    }
}

export default verifyToken