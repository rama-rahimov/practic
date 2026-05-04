import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
      type: Number,
      default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


export const UserModel = mongoose.model('user', userSchema);