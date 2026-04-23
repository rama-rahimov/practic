import {ConversationModel} from "../database/models.js";
import {redis} from "../redis.js";

export const conversationFindByGuestId = async (guestId) => {
    try {
        if(await redis.get(`conByGuestId:${guestId}`)) {
          JSON.parse(await redis.get(`conByGuestId:${guestId}`));
        }else {
            const conversation = await ConversationModel.findOne({
                participants:{
                    $elemMatch: {
                        type:"guest",
                        guestId
                    }
                }
            });
           await redis.set(`conByGuestId:${guestId}`, JSON.stringify(conversation));
           return conversation;
        }
    }catch(error) {
        console.log({errRR: error});
    }
}

export const findUser = async (email) => {
    try {
        if(await redis.get(`emailR:${email}`)) {
            return JSON.parse(await redis.get(`emailR:${email}`));
        }
    }catch(error) {
        console.log({error});
    }
}