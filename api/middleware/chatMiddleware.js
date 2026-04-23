import cookie from "cookie";
import jwt from "jsonwebtoken";
import {UserModel} from "../database/models.js";
import 'dotenv/config';

export default async  (socket, next) =>  {
    try {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        const guestId = cookies.guestId;
        const token = (socket.handshake.auth || {}).token || "" ;
        let user = "";
        if(token && token !== "undefined") {
          const payload = await jwt.verify(token, process.env.JWT_SECRET);
          user = await UserModel.findOne({ email: payload.email });
        }
        socket.guestId = guestId;
        socket.user = user;
        next();
    }catch(err) {
        console.log(err);
    }
}