import express from "express";
import multer from "multer";
import {serviceCloudinaryFile} from "../services/service.cloudinaryFile.js";
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
router.post('/upload', upload.single('file'), serviceCloudinaryFile);

export default router;