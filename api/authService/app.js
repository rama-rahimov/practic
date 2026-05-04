import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connection.js";
import authController from "./controller.js";
const app = express();
app.use(express.json({limit: "10mb"}));
await connectDB();
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3002"],
    credentials: true,
}));
app.use(cookieParser());
app.use('/api', authController);
const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});