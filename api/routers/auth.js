import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import {ConversationModel, MessageModel, UserModel} from "../database/models.js";
import cookie from "../middleware/cookie.js";
import {conversationFindByGuestId} from "../middleware/dbResdisAction.js";
const router = express.Router();

router.post('/register', cookie, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
             res.status(400).json({ error: "Please enter fill all fields !" });
        }else {
            const user = await UserModel.findOne({email: email});
            if (user?.id) {
                res.status(400).json({error: "This user already exists!"});
            } else {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);
                const registerUser = await UserModel.create({name, email, password: hash});
                if (req.guestId && registerUser?.role === 1) {
                    const getConvGuest = await conversationFindByGuestId(req.guestId);
                    console.log({ getConvGuest });
                    if (getConvGuest?._id) {
                        const participants = getConvGuest.participants;
                        participants.pop();
                        const updateConversation = await ConversationModel.updateMany({
                            participants: {
                                $elemMatch: {
                                    type: "guest",
                                    guestId: req.guestId,
                                }
                            }
                        }, {$set: {participants: [...participants, {type: "guest", guestId: registerUser._id}]}})
                        console.log({updateConversation});
                        const updateMessages = await MessageModel.updateMany({
                           "sender.type":"guest",
                            "sender.guestId":req.guestId
                        }, {
                            $set: {
                                "sender.guestId": registerUser._id.toString()
                            }
                        });
                        console.log({updateMessages});
                    }
                }
                res.status(201).json({error: false, success: true});
            }
        }
    }catch(err) {
        console.log(err);
        res.json({ error: err.message });
    }
});

router.post('/login', cookie, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({error: "Please enter fill all fields!"});
        }else {
            const user = await UserModel.findOne({ email: email });
            if (!user?.id) {
                res.status(400).json({error: "User not found!"});
            }else {
                const pass = await bcrypt.compare(password, user.password);
                if (!pass) {
                    res.status(400).json({error: "Password not match!"});
                }else {
                    res.json({ token: await jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET) });
                }
            }
        }
    }catch(err) {
        console.log(err);
        return res.json({ error: err.message });
    }
});

export default router;