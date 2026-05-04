import cloudinary from "../help/cloudinary.js";
import {FileModel} from "../db/models.js";

export const serviceCloudinaryFile =  async (req, res) => {
    try {
        const file = req.file;
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'practic' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
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
};