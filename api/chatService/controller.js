import express from "express";
import adminAuth from "./middleware/authAdmin.js";
import authentication from "./middleware/authentication.js";
import RouterService from "./routerService.js";
const router = express.Router();

router.get('/conversation', adminAuth, RouterService.getAllConversations);

router.get('/messages/:conversationId', adminAuth, RouterService.getMessagesByGuestId);

router.get('/messages',  authentication, RouterService.getMessagesClient);

router.post('/editConversation', RouterService.editConversation);

router.post('/editMessage', RouterService.editMessage);

router.get('/getConversationByGuestId/:guestId', RouterService.getConvByGuestId)

export default router;