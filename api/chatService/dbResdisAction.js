import {redis} from "./redis.js";
import {ConversationModel} from "./db/models.js";

export const getAdmin = async () => {
    const adminRedis = await redis.get(`admin`);
    if(adminRedis){
        return JSON.parse(adminRedis);
    }else {
        const adminJson = await fetch(`${process.env.HTTP_AUTH}/user-admin`);
        const admin = await adminJson.json();
        await redis.set(`admin`, JSON.stringify(admin.data));
        return admin.data;
    }
}

export const conversationFindByGuestId = async (guestId) => {
    try {
        const conByGuestId = await redis.get(`conByGuestId:${guestId}`);
        if(conByGuestId && conByGuestId !== 'null') {
           return JSON.parse(conByGuestId);
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

export const setRedisConId = async (conId) => {
    await redis.set(`conId:${conId}`, conId);
}