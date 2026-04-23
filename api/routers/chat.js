import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import authentication from "../middleware/verifyToken.js";
import {allConversations, getMessages, getMessagesByGuestId, handlerMessage} from "../middleware/chatFunctions.js";
import cookie from "../middleware/cookie.js";
export const router = express.Router();
export const chat = (socket, io) => {
    socket.on('msg', async (msg) => {
      await handlerMessage(socket, msg, (roomId)=> {
        io.to(roomId).emit('take_msg', msg);
     });
    });
    socket.on("join_room",(roomId) => {
        socket.join(roomId);
    });
    socket.on('disconnect', () => {
        console.log('socket disconnect', socket.id);
    })
}

router.get('/conversation', adminAuth, async (req, res) => {
  try {
    const all = await allConversations();
    return res.json({ all });
  }catch(err) {
      console.log({err});
  }
});

router.get('/messages/:conversationId', adminAuth, async (req, res) => {
   try {
       const messages = await getMessages(req.params.conversationId);
       const msg = (messages || []).map(el => ({msg: el.text, type: (el.sender || {}).type === "guest"?1:10}))
       return res.json({ messages: msg });
   }catch(err) {
       console.log({err});
   }
});

router.get('/messages', cookie, authentication, async (req, res) => {
    try {
        const messages = await getMessagesByGuestId(req.user?.id ? req.user.id : req.guestId);
        const msg = (messages || []).map(el => ({msg: el.text, type: (el.sender || {}).type === "guest"?1:10}))
        return res.json({ messages: msg });
    }catch(err) {
        console.log({err});
    }
});

export default router;