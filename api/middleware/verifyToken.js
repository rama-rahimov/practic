import jwt from 'jsonwebtoken';
import { UserModel } from "../database/models.js";
import 'dotenv/config';
export default async function (req, res, next) {
    try {
      const auth = req.headers.authorization;
      if (!auth || !auth.split(" ")[1]) throw new Error("Token is required");
      const token = auth.split(" ")[1];
      const payload = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findOne({ email: payload.email });
      if (!user) throw new Error("User does not exist");
      req.user = user;
      next();
    }catch(err) {
        console.log(err);
        return res.json({ error: err.message });
    }
}