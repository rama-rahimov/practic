import express from 'express';
import multer from 'multer';
import cookie from '../help/cookie.js';
import {deleteImage, getMyImages, save} from "../services/service.cloudinaryCookie.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/save', cookie, upload.single('file'), save);

router.get('/my-images', cookie, getMyImages);

router.delete('/image/:id', deleteImage);

export default router;