import cloudinary from "../cloudinary.js";
import express from "express";
import multer from "multer";
import { FileModel } from "../database/models.js";
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'practic' },
           (error, result) => {
           if (error) return reject(error);
           resolve(result);
          }
          );
          stream.end(file.buffer);
        });
        await FileModel.create({
            public_id: result.public_id,
            path: result.secure_url,
            originalName: result.asset_folder
        })
        res.json({ url: result.secure_url });
    } catch (err) {
        console.log({ err });
        res.status(500).send(err);
    }
});

export default router;