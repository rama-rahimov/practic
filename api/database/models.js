import mongoose from 'mongoose';

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

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sender: {
        type: {
            type: String, // "admin" или "guest"
            enum: ["admin", "guest"],
            required: true,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        guestId: {
            type: String
        }
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: {
                type: String, // "user" или "guest"
                enum: ["admin", "guest"],
                required: true
            },
            adminId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            guestId: {
                type: String
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const UserSchema = new mongoose.Schema({
   name: String,
   email: {
       type: String,
       unique: true,
       required: true,
       trim: true
   },
    password: {
        type: String,
        required: true
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


export const ConversationModel = mongoose.model('conversation', conversationSchema);
export const MessageModel = mongoose.model('message', messageSchema);
export const UserModel = mongoose.model('user', UserSchema);
export const FileModel = new mongoose.model('files', fileSchema);
export const ImageModel = mongoose.model('image', imageSchema);
