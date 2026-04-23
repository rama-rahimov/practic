import {ConversationModel, MessageModel, UserModel} from "../database/models.js";
import {redis} from "../redis.js";
import {conversationFindByGuestId} from "./dbResdisAction.js";

export async function handlerMessage(socket, {roomId, message }, callback) {
    try {
        let admin = await UserModel.findOne({role:10});
        let userId = "";
        if(roomId) {
            await addMessage(roomId, message, admin._id, 10);
            callback(roomId);
        } else {
        if(socket.user?._id) {
            userId = socket.user._id.toString();
        } else {
            userId = socket.guestId;
        }
        const check = await checkConversation(admin._id, userId);
        if(!check?._id){
         const add = await addConversation(admin._id, userId);
         socket.join(add._id);
         await addMessage(add._id, message, userId, 1);
            callback(add._id.toString());
         }else {
            socket.join(check._id.toString());
            await addMessage(check._id, message, userId, 1);
            callback(check._id);
         }
        }
    }catch(error) {
        console.log({error});
    }
}

async function checkConversation(adminId, guestId) {
    try {
        return (await ConversationModel.findOne({ participants: {
                $all:([
                    {$elemMatch: {type:  "admin", adminId}},
                    {$elemMatch: {type: "guest", guestId}},
                ])
            }}));
    }catch(error) {
        console.log(error);
    }
}

async function addConversation(adminId, guestId) {
    try {
        const addConversation = await ConversationModel.create({
            participants: [
                {type:"admin", adminId},
                {type:"guest", guestId},
            ]
        });
        console.log({idConversation: addConversation._id});
        await redis.set(`conId:${addConversation._id.toString()}`, addConversation._id.toString());
        return addConversation;
    }catch(error) {
        console.log(error);
    }
}

async function addMessage(conversationId, message, userId, writer) {
    try {
        const data = writer > 1 ? { "type": "admin", adminId: userId }:{ "type": "guest", guestId: userId };
        return (await MessageModel.create({
            sender: data,
            text: message,
            conversationId
        }))
    }catch (error) {
        console.log(error);
    }
}

export async function allConversations() {
    return (
        await ConversationModel.find()
    )
}

export async function getMessages(conversationId) {
    return (
        await MessageModel.find({conversationId})
    )
}

export async function getMessagesByGuestId(guestId) {
    const conversationId = await conversationFindByGuestId(guestId);
    return (await getMessages(conversationId));
}