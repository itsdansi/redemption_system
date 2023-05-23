import {Router} from "express";
import authRoute from "./auth.routes";
import userRoute from "./user.routes";
import productRoute from "./product.routes";

const router = Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/product", productRoute);

export default router;
