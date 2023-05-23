import express from "express";
import {authenticatedUser} from "../controller/user.controller";

const router = express.Router();

router.get("/me", authenticatedUser);

export default router;
