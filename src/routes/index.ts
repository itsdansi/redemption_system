import {Router} from "express";
import authRoute from "./auth.routes";
import userRoute from "./user.routes";
import productRoute from "./product.routes";
import cartRoute from "./cart.routes";
import orderRoute from "./order.routes";
import bankTransfer from "./bank-transfer";

const router = Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/product", productRoute);
router.use("/cart", cartRoute);
router.use("/order", orderRoute);
router.use("/bank-trasnfer", bankTransfer);

export default router;
