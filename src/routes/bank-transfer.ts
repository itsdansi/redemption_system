import express from "express";
import {
  createTransfer,
  getAllTrasnferHistory,
} from "../controller/bankTransfer.controller";
import {isAuth} from "../middleware/isAuth";
import {validateCreateBankTransfer} from "../validators/requests/bank-transfer";

const router = express.Router();

router.get("/", isAuth, getAllTrasnferHistory);
router.post("/create", isAuth, validateCreateBankTransfer, createTransfer);
export default router;
