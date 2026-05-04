import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/file');
    }catch(err) {
        console.error(err);
        process.exit(1);
    }
}