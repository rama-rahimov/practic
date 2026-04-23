import { v4 as uuidv4 } from 'uuid';

export default async (req, res, next) => {
    if (!(req.cookies || {}).guestId) {
      const id = uuidv4();
      res.cookie('guestId', id, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 год
        sameSite: "lax"
      });
      req.guestId = id;
    } else {
      req.guestId = req.cookies.guestId;
    }
    next();
};