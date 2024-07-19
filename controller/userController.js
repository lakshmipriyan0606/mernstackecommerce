import bcrypt from "bcrypt";
import { UserModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        status: false,
        message: "Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user = { email, name, hashPassword };

    const OTP = Math.floor(Math.random() * 1000000);

    const activateCode = jwt.sign({ user, OTP }, process.env.ACTIVATE_CODE, {
      expiresIn: "5m",
    });

    const subject = "Verification code to register your account";
    const message = `Hi,\n\nPlease use the verification code below to complete your registration:\n\n${OTP}\n\nThank you.`;

    await sendMail(email, subject, message);

    return res.status(200).json({
      status: true,
      message: "OTP sent to your email",
      activateCode,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp, activateToken } = req.body;

    const verify = jwt.verify(activateToken, process.env.ACTIVATE_CODE);
    const { name, hashPassword, email } = verify?.user;

    if (!verify) {
      return res.status(400).json({
        status: false,
        message: "OTP Expired",
      });
    }

    if (verify.OTP !== otp) {
      return res.status(400).json({
        status: false,
        message: "Invalid OTP",
      });
    }

    await UserModel.create({
      name,
      email,
      password: hashPassword,
    });

    res.status(201).json({
      status: true,
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials",
      });
    }
    const passwordStatus = await bcrypt.compare(password, user.password);
    if (!passwordStatus) {
      return res.status(400).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    const loginToken = jwt.sign({ _id: user._id }, process.env.LOGINTOKEN, {
      expiresIn: "5d",
    });

    const { password: userPassword, ...userDetail } = user.toObject();

    return res.status(200).json({
      status: true,
      message: "Successfully login",
      token: loginToken,
      userDetail,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const getProfileDetail = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    return res.status(200).json({
      status: true,
      message: "user detail data is available",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      status: false,
    });
  }
};
