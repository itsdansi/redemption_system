import express from "express";
import {authenticatedUser, updateUserProfile} from "../controller/user.controller";

const router = express.Router();

router.get("/me", authenticatedUser);
router.post("/complete-user-profile", updateUserProfile);

export default router;
