import jwt from 'jsonwebtoken';
import 'dotenv/config';
export default async function (req, res, next) {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.split(" ")[1]) throw new Error("Token is required");
        const token = auth.split(" ")[1];
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        const userJson = await fetch(`${process.env.HTTP_AUTH}/${payload.email}`);
        const user = await userJson.json();
        if (!user.data) throw new Error("User does not exist");
        req.user = user?.data;
        next();
    }catch(err) {
        console.log(err);
        return res.json({ error: true, msg: err.message });
    }
}