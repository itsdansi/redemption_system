import express from "express";
import {
  // loginHandler,
  logoutHandler,
  refreshTokenHandler,
  registerHandler,
} from "../controller/auth.controller";
import {
  validateLoginSchema,
  validateRegisterSchema,
} from "../validators/requests/auth.requests";
import {loginWithOTP, sendOTP} from "../controller/auth2.controller";

const router = express.Router();

// router.post("/register", validateRegisterSchema, registerHandler);
// router.post("/login", validateLoginSchema, loginHandler);
router.post("/get-otp", sendOTP);
router.post("/login-with-otp", loginWithOTP);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logoutHandler);

export default router;
