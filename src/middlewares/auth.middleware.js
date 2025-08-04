import User from "../models/user.model.js";
import { decodeJwt } from "../utils/jsonwebtoken.util.js";

const AuthMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if(!token) {
    return res.status(400).json({
      message: 'Unauthorized access denied'
    });
  }

  const decodedUser = await decodeJwt(token);
  const user = await User.findOne({ _id: decodedUser.id });

  req.user = user
  next();
}

export default AuthMiddleware;