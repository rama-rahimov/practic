export const save = async (req, res) => {
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
        await redis.set(`imgId:${image?._id}`, JSON.stringify(image));
        console.log({image});
        res.json({url: image.url});
    }catch(err) {
        res.json({ error: true, message: err });
    }
}

export const getMyImages = async (req, res) => {
    try {
        const images = await ImageModel.find({ guestId: req.guestId });
        res.json(images);
    }catch(err) {
        res.json({ error: true, message: err });
    }
}

export const deleteImage = async (req, res) => {
    try {
        const redisImg = JSON.parse(await redis.get(`imgId:${req.params.id}`) || {});
        let image = {};
        if(redisImg?._id){
            image = redisImg;
        }else {
            image = await ImageModel.findById(req.params.id);
            await redis.set(`imgId:${req.params.id}`, JSON.stringify(image));
        }
        await cloudinary.uploader.destroy(image.publicId);
        await image.deleteOne();
        res.json({ ok: true });
    }catch(err) {
        res.status(500).json({ error: true, message: err });
    }
}