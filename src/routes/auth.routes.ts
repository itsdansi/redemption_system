import express from "express";
import {
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
  registerHandler,
} from "../controller/auth.controller";
import {
  validateLoginSchema,
  validateRegisterSchema,
} from "../validators/requests/auth.requests";

const router = express.Router();

router.post("/register", validateRegisterSchema, registerHandler);
router.post("/login", validateLoginSchema, loginHandler);
router.post("/refresh", refreshTokenHandler);
router.post("/logout", logoutHandler);

export default router;
