import express from "express"
import { addBookmarkController, getBookmarkController, deleteBookmarkController, updateBookmarkController } from "../controllers/bookmarks.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post('/add', verifyToken, addBookmarkController);
router.get('/get', verifyToken, getBookmarkController);
router.patch('/update/:id', verifyToken, updateBookmarkController);
router.post('/delete/:id', verifyToken, deleteBookmarkController);

export default router