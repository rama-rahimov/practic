import mongoose from 'mongoose';
export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/auth_pr');
        console.log('Connected to MongoDB Auth');
    }catch(err) {
        console.log("DB error:", err);
        process.exit(1);
    }
}