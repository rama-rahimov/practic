import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import { UserModel } from "../database/models.js";
import cookie from "../middleware/cookie.js";
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
             res.status(400).json({ error: "Please enter fill all fields !" });
        }
        const user = await UserModel.findOne({ email: email });
        if (user?.id) {
            res.status(400).json({error: "This user already exists!"});
        }else {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            await UserModel.create({name, email, password: hash});
            res.status(201).json({error: false, success: true});
        }
    }catch(err) {
        console.log(err);
        return res.json({ error: err.message });
    }
});

router.post('/login', cookie, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)  res.status(400).json({ error: "Please enter fill all fields!" });
        const user = await UserModel.findOne({ email: email });
        if (!user.id)  res.status(400).json({ error: "User not found!" });
        if(user.role === 1) {
            res.json({ success: true });
        } else {
            const pass = await bcrypt.compare(password, user.password);
            if (!pass)  res.status(400).json({ error: "Password not match!" });
            res.json({ token: await jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET) });
        }
    }catch(err) {
        console.log(err);
        return res.json({ error: err.message });
    }
});

export default router;