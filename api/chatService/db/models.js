import mongoose from "mongoose";

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


export const ConversationModel = await mongoose.model('conversations', conversationSchema);
export const MessageModel = await mongoose.model('messages', messageSchema);