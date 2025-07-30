import express from "express";
import { processReminderController } from "../controllers/reminder";
const router = express.Router();

router.get("/process", processReminderController)

export default router