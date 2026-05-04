import cookie from "cookie";
import jwt from "jsonwebtoken";
import {getAdmin, setRedisConId} from "./dbResdisAction.js";
import {ConversationModel, MessageModel} from "./db/models.js";

class socketService {
    handlerChatMiddleware = async (socket, next) => {
        const auth = socket.handshake.auth?.token || "";
        const rawCookies = socket.handshake.headers.cookie || "";
        const guestId = cookie.parse(rawCookies)?.guestId ;
        let user = "";
        if (auth) {
            const payload = await jwt.verify(auth, process.env.JWT_SECRET);
            const userJson = await fetch(`${process.env.HTTP_AUTH}/${payload.email}`);
            user = await userJson.json();
            if (user.data?._id) {
                socket.user = user.data;
                next();
            }else {
                throw new Error("User does not exist");
            }
        }else {
            socket.guestId = guestId;
            next();
        }
    }
    handlerMessage = async (socket, {roomId, message }, callback) => {
        try {
            let admin = await getAdmin();
            let userId = "";
            if(roomId) {
                await this.addMessage(roomId, message, admin._id, 10);
                callback(roomId);
            } else {
                if(socket.user?._id) {
                    userId = socket.user._id.toString();
                } else {
                    userId = socket.guestId;
                }
                const check = await this.checkConversation(admin._id, userId);
                if(!check?._id){
                    const add = await this.addConversation(admin._id, userId);
                    socket.join(add._id);
                    await this.addMessage(add._id, message, userId, 1);
                    callback(add._id.toString());
                }else {
                    socket.join(check._id.toString());
                    await this.addMessage(check._id, message, userId, 1);
                    callback(check._id);
                }
            }
        }catch(error) {
            console.log({error});
        }
    }
    addMessage = async (conversationId, message, userId, writer) => {
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
    checkConversation = async (adminId, guestId) => {
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
    addConversation = async (adminId, guestId) => {
        try {
            const addConversation = await ConversationModel.create({
                participants: [
                    {type:"admin", adminId},
                    {type:"guest", guestId},
                ]
            });
            await setRedisConId(addConversation._id.toString())
            return addConversation;
        }catch(error) {
            console.log(error);
        }
    }
}

export default new socketService();