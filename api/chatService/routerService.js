import {ConversationModel, MessageModel} from "./db/models.js";
import {conversationFindByGuestId} from "./dbResdisAction.js";

class RouterService {
    getAllConversations = async (req, res) => {
        try {
            const data = await ConversationModel.find()
            return res.json({ error: false, data });
        }catch(error) {
            console.log({ error: true, msg: error.message });
        }
    }
    getMessagesByGuestId = async (req, res) => {
        try {
          const conversationId = req.params.conversationId;
          const messages = await MessageModel.find({ conversationId });
          return res.json({ error: false, data: this.structuredMessages(messages)});
        }catch(error) {
            console.log({error: true, msg: error.message});
        }
    }
    getMessagesClient = async (req, res) => {
        try {
            const guestId = req.user?._id ? req.user._id : req.guestId;
            const conversationId = await ConversationModel.findOne({ participants:{
                $elemMatch:{
                    type: "guest", guestId
                }
            }});
            const messages = await MessageModel.find({ conversationId });
            console.log({ conversationId, messages });
            return res.json({ error: false, data: this.structuredMessages(messages) });
        }catch(error) {
            console.log({error: true, msg: error.message});
        }
    }
    editConversation = async (req, res) => {
        try {
            const { participants, guestId } = req.body;
            const data =  await ConversationModel.updateMany(
                { participants:{
                        $elemMatch: {
                            type: "guest",
                            guestId
                        }
                    }},{
                    $set:{
                        participants: participants
                    }
                }
            );
            res.json({error: false, data });
        } catch (error){
            res.json({ error: true, msg: error.message });
        }
    }
    editMessage = async (req, res) => {
        try {
            const { registerUserId, guestId } = req.body;
            const  data = await MessageModel.updateMany({
                sender:{
                    type: "guest",
                    guestId
                }
            }, { $set: { sender: {type: "guest", guestId: registerUserId } } });
            res.json({error: true, data});
        } catch (error){
            console.log({ error: true, msg: error.message });
        }
    }
    getConvByGuestId = async (req, res) => {
        try {
          const data = await conversationFindByGuestId(req.params.guestId);
          return res.json({error: true, data});
        }catch(err){
          res.json({ error: false, message: err.message });
        }
    }
    structuredMessages = (msg) => {
        return msg.map((c) => ({ type: c.sender.type === "admin" ? 10 : 1, msg: c.text }))
    }
  }

export default new RouterService;