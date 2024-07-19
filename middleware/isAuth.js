import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Please login to access",
      });
    }
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
