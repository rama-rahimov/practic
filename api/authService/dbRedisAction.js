import {redis} from "./redis.js";
import {UserModel} from "./db/models.js";

export const findOneUser = async (email) => {
    try {
        const userRedis = await redis.get(`emailR:${email}`);
        if(userRedis) {
            return (await JSON.parse(userRedis));
        }else {
            const user = await UserModel.findOne({ email });
            if (user?._id) {
                await redis.set(`emailR:${email}`, JSON.stringify(user));
            }
            return user;
        }
    }catch(error) {
        console.log({error});
    }
}

export const conversationFindByGuestId = async (guestId) => {
    try {
        const conByGuestId = await redis.get(`conByGuestId:${guestId}`);
        if(conByGuestId) {
          return JSON.parse(conByGuestId);
        }else {
            const conversationJson = await fetch(`http://localhost:3002/chat/getConversationByGuestId/${guestId}`);
            const conversation = await conversationJson.json();
            await redis.set(`conByGuestId:${guestId}`, JSON.stringify(conversation));
            return conversation;
        }
    }catch(error) {
        console.log({errRR: error});
    }
}