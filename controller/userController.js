import bcrypt from "bcrypt";
import { UserModel } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";
import { responseStatus } from "../utilis/statusFunction.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await UserModel.findOne({ email });

    if (user) {
      await responseStatus(res, 400, false, "Email already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user = { email, name, hashPassword };

    const OTP = Math.floor(Math.random() * 1000000);

    const activateCode = jwt.sign({ user, OTP }, process.env.ACTIVATE_CODE, {
      expiresIn: "5m",
    });

    const subject = "Verification code to register your account";
    const message = `Hi,\n\nPlease use the verification code below to complete your registration:\n\n${OTP}\n\nThank you.`;
    const responseMsg = "OTP sent to your email";

    await sendMail(email, subject, message);

    await responseStatus(res, 200, true, responseMsg, activateCode);
  } catch (err) {
    await responseStatus(res, 400, false, "Internal server error");
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otp, activateToken } = req.body;

    const verify = jwt.verify(activateToken, process.env.ACTIVATE_CODE);
    const { name, hashPassword, email } = verify?.user;

    if (!verify) {
      await responseStatus(res, 400, false, "OTP Expired");
    }

    if (verify.OTP !== otp) {
      await responseStatus(res, 400, false, "Invalid OTP");
    }

    await UserModel.create({
      name,
      email,
      password: hashPassword,
    });

    await responseStatus(res, 201, true, "User created successfully");
  } catch (err) {
    await responseStatus(res, 400, false, err.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      await responseStatus(res, 400, false, "Invalid credentials");
    }
    const passwordStatus = await bcrypt.compare(password, user.password);

    if (!passwordStatus) {
      await responseStatus(res, 400, false, "Invalid credentials");
    }

    const loginToken = jwt.sign({ _id: user._id }, process.env.LOGINTOKEN, {
      expiresIn: "5d",
    });

    const { password: userPassword, ...userDetail } = user.toObject();

    const data = { userDetail, loginToken };

    await responseStatus(res, 200, true, "Successfully login", data);
  } catch (error) {
    await responseStatus(res, 400, false, err.message);
  }
};

export const getProfileDetail = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    const message = "User detail data is available";
    await responseStatus(res, 200, true, message, userDetail);
  } catch (error) {
    await responseStatus(res, 400, false, error.message);
  }
};
