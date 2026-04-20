import express from 'express';
import fileSystem from "./routers/fileSystem.js";
import fileCloudinary from "./routers/fileCloudinary.js";
import fileWithCookie from "./routers/fileWithCookie.js";
import cookieParser from "cookie-parser";
import chatMiddleware from "./middleware/chatMiddleware.js";
import {chat} from "./routers/chat.js";
import auth from "./routers/auth.js";
import { connectDB } from "./database/connection.js";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
app.use(cookieParser());
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
});
const chatNamespace = io.of("/chat");
chatNamespace.use(chatMiddleware);
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({limit: "10mb"}));
await connectDB();
app.use('/', fileSystem);
app.use('/fileCloudinary', fileCloudinary);
app.use('/fileWithCookie', fileWithCookie);
app.use('/auth', auth);
chatNamespace.on('connection', chat);

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
})