import express from "express";
import {
  loginWithOTP,
  logoutHandler,
  refreshTokenHandler,
  sendOTP,
} from "../controller/auth2.controller";

const router = express.Router();

router.post("/get-otp", sendOTP);
router.post("/login-with-otp", loginWithOTP);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logoutHandler);

export default router;
