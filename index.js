import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './db.js';
import authRoutes from './routes/auth.js'
import bookmarkRoutes from './routes/bookmarks.js'
import "./cron.js"

import cors from "cors"
const port = process.env.PORT || 5000;
const app = express();

dotenv.config();
dbConnect();

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000", "https://revisitly-frontend.vercel.app"],
        credentials: true,
    })
)

app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes)

app.get('/', (req, res) => {
    res.send('hello')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})