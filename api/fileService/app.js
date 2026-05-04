import express from 'express';
import http from "http";
import cors from "cors";
import fsFiles from './controllers/controller.fs.js';
import fileCloudinaryCookie from "./controllers/controller.cloudinaryCookie.js";
import fileCloudinaryFile from "./controllers/controller.cloudinaryFile.js";
const app = express();
app.use(express.json({limit: "10mb"}));
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:3002"],
    credentials: true
}));
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
app.use('/fsFiles', fsFiles);
app.use('/fileCloudinaryCookie', fileCloudinaryCookie);
app.use('/fileCloudinaryFile', fileCloudinaryFile);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});