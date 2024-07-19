import express from "express";
import {
    getProfileDetail,
  loginUser,
  registerUser,
  verifyOTP,
} from "../controller/userController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/verifyotp", verifyOTP);
router.post("/user/login", loginUser);
router.get("/user/getProfile", isAuth, getProfileDetail);

export default router;
