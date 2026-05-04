import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    url: String,
    publicId: String,

    guestId: String, // 👈 главное поле

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    originalName: String,
    size: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const FileModel = new mongoose.model('files', fileSchema);
export const ImageModel = mongoose.model('image', imageSchema);