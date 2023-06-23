import express from "express";
import {isAuth} from "../middleware/isAuth";
import {createOrder, getUserOrderHistory} from "../controller/order.controller";

const router = express.Router();

router.post("/", isAuth, createOrder);
router.get("/", isAuth, getUserOrderHistory);

export default router;
