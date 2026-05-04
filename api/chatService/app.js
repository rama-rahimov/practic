import express from 'express';
const app = express();
import http from 'http';
import { Server } from 'socket.io';
import {chat} from "./gateway.js";
import cors from "cors";
import chatRouter from "./controller.js";
import {connectDB} from "./db/connection.js";
import socketService from "./socketService.js";
import authAdmin from "./middleware/authAdmin.js";
const server = http.createServer(app);
const port = process.env.PORT || 3002;
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}));
app.use(express.json({limit: "10mb"}));
await  connectDB();
app.get('/chat/profile', authAdmin, (req, res) => {
    res.json({ error: false, data: req.user });
});
app.use('/chat', chatRouter);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    }
});

const chatNameSpace = io.of('/chat');
chatNameSpace.use(socketService.handlerChatMiddleware);
chatNameSpace.on('connection', (socket) => chat(socket, chatNameSpace));

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})