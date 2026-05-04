import {conversationFindByGuestId, findOneUser} from "./dbRedisAction.js";
import bcrypt from "bcryptjs";
import {UserModel} from "./db/models.js";
import {redis} from "./redis.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

class AuthService {
    constructor() {}
    async register(req, res) {
            try {
                const { name, email, password } = req.body;
                if (!name || !email || !password) {
                    res.status(422).json({ error: true, msg: "Please enter fill all fields !" });
                }else {
                    const user = await findOneUser(email);
                    if (user?.id) {
                        res.status(409).json({error: true, msg: "This user already exists!"});
                    } else {
                        const salt = await bcrypt.genSalt(10);
                        const hash = await bcrypt.hash(password, salt);
                        const registerUser = await UserModel.create({name, email, password: hash});
                        await redis.set(`emailR:${registerUser?.email}`, JSON.stringify(registerUser));
                        if (req.guestId && registerUser?.role === 1) {
                            const getConvGuest = await conversationFindByGuestId(req.guestId);
                            if (getConvGuest.data?._id) {
                                const participants = getConvGuest.data.participants;
                                participants.pop();
                                participants.push({type:"guest", guestId: registerUser._id.toString()});
                                await fetch(`${process.env.HTTP_CHAT}/editConversation`,{
                                    method: 'POST',
                                    body: JSON.stringify({ participants, guestId: req.guestId }),
                                    headers:{
                                        'Content-Type': 'application/json'
                                    }
                                });
                                await fetch(`${process.env.HTTP_CHAT}/editMessage`,{
                                    method: 'POST',
                                    body: JSON.stringify({ guestId: req.guestId, registerUserId: registerUser._id.toString() }),
                                    headers:{
                                        'Content-Type': 'application/json'
                                    }
                                });
                            }
                        }
                        res.status(201).json({ error: false, msg: "Successfully registered" });
                    }
                }
            }catch(err) {
                res.json({ error: true, msg: err.message });
            }
    }

    async login(req, res) {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(422).json({error: true, msg: "Please enter fill all fields!"});
                }else {
                    const user = await findOneUser(email);
                    if (!user?._id) {
                        res.status(404).json({error: true, msg: "User not found!"});
                    }else {
                        const pass = await bcrypt.compare(password, user.password);
                        if (!pass) {
                            res.status(400).json({error: true, msg: "Password not match!"});
                        }else {
                            res.json({ error: false, message: 'Successfully log in', token: await jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET) });
                        }
                    }
                }
            }catch(err) {
                return res.json({ error: true, msg: err.message });
            }
    }

    async getUser (req, res){
      try {
        const data = await findOneUser(req.params.email);
        res.json({error: false, data });
      }catch(err) {
        res.status(400).json({error: true, msg: err.message});
      }
    }

    async getAdmin (req, res){
        try {
            const data = await UserModel.findOne({role:10});
            res.json({error: false, data});
        }catch(err) {
            res.json({ error: true, msg: err.message });
        }
    }
}



export default new AuthService();