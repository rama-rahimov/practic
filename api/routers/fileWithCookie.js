import express from 'express';
import multer from 'multer';
import cookie from "../middleware/cookie.js";
import cloudinary from "../cloudinary.js";
import {ImageModel} from "../database/models.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/save', cookie, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        console.log({ file });
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {folder: 'guests', transformation: [
                        { width: 1000, crop: "limit", quality: "auto" }
                    ]},
                (err, result) => {
                    if(err) return reject(err);
                    resolve(result);
                }
            );
            stream.end(file.buffer);
        });
        const image = await ImageModel.create({
            url: result.secure_url,
            publicId: result.public_id,
            guestId: req.guestId
        });
        console.log({image});
        res.json({url: image.url});
    }catch(err) {
        res.json({ error: true, message: err });
    }
});

router.get('/my-images', cookie, async (req, res) => {
    try {
        console.log({ guestId: req.guestId });
        const images = await ImageModel.find({ guestId: req.guestId });
        console.log({ images });
        res.json(images);
    }catch(err) {
        res.json({ error: true, message: err });
    }
});

router.delete('/image/:id', async (req, res) => {
    try {
        const image = await ImageModel.findById(req.params.id);
        await cloudinary.uploader.destroy(image.publicId);
        await image.deleteOne();
        res.json({ ok: true });
    }catch(err) {
        res.status(500).json({ error: true, message: err });
    }
});

export default router;