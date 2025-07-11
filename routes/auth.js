import express from "express"
import { loginController, signupController, socialLoginController } from "../controllers/auth.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/social-login', socialLoginController);

export default router