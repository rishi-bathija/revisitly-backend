import express from "express";
import { processReminderController } from "../controllers/reminder.js";
const router = express.Router();

router.get("/process", processReminderController)

export default router