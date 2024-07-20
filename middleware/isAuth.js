import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";
import { checkToken } from "../utilis/index.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    await checkToken(token, res);
    const decodeData = await jwt.verify(token, process.env.LOGINTOKEN);
    // console.log('decodeData: ', decodeData);
    req.user = await UserModel.findById(decodeData._id);
    next();
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
