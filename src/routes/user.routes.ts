import express from "express";
import {authenticatedUser, updateUserProfile} from "../controller/user.controller";
import {importUserData} from "../crawler";

const router = express.Router();

router.get("/me", authenticatedUser);
router.post("/complete-user-profile", updateUserProfile);
router.get("/import-user", importUserData);

export default router;
