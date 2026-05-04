import "dotenv/config";
import express from "express";
import cookie from "./middleware/cookie.js"
import ChatService from "./service.js";
const router = express.Router();

router.post('/register', cookie, ChatService.register);

router.post('/login', cookie, ChatService.login);

router.get('/user/:email', ChatService.getUser);
router.get('/user-admin', ChatService.getAdmin);

export default router;