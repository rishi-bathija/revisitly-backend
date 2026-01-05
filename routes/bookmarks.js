import express from "express"
import { addBookmarkController, getBookmarkController, deleteBookmarkController, updateBookmarkController, emailReminderController, verifyReminderTokenController, getSingleBookmarkController, trackBookmarkOpenController, updateSmartReminderController } from "../controllers/bookmarks.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post('/add', verifyToken, addBookmarkController);
router.get('/get', verifyToken, getBookmarkController);
router.get("/get/:id", verifyToken, getSingleBookmarkController);
router.patch('/update/:id', verifyToken, updateBookmarkController);
router.post('/remind-by-email', emailReminderController);
router.post('/verify-reminder-token', verifyReminderTokenController);
router.post('/delete/:id', verifyToken, deleteBookmarkController);

// smart reminder routes
router.post('/track/:id', verifyToken, trackBookmarkOpenController);
router.patch('/smart-reminder/:id', verifyToken, updateSmartReminderController);

export default router