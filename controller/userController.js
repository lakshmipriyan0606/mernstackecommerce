// try{

// }
// catch(err) {

// }

import bcrypt from "bcrypt";
import { userModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { status } from "express/lib/response";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    const user = userModel.findOne({ email });

    if (user) {
      return res.send({
        status: false,
        message: "Email is already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(Math.random * 1000000);

    const activateCode = jwt.sign({ user, otp }, process.env.ACTIVATE_CODE);
    
  } catch (err) {
    res.send({
      status: false,
      message: "Internal server error",
    });
  }
};
