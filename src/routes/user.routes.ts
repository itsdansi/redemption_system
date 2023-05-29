import express from "express";
import {
  authenticatedUser,
  generateReferralLink,
  isUserExists,
  // referralLink,
  updateUserProfile,
} from "../controller/user.controller";
import {isAuth} from "../middleware/isAuth";
import {importUserData} from "../crawler";

const router = express.Router();

router.get("/me", authenticatedUser);
router.get("/does-user-exist", isUserExists);
// router.get("/referral-link", isAuth, referralLink);
router.patch("/generate-referral-link", isAuth, generateReferralLink);
router.post("/complete-user-profile", updateUserProfile);
router.get("/import-user", importUserData);
export default router;
