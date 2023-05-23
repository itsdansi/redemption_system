import express from "express";
import {isAuth} from "../middleware/isAuth";
import {getAllProducts} from "../controller/product.controller";
import {validateGetProductFilterSchema} from "../validators/requests/product.requests";

const router = express.Router();

router.get("/", isAuth, validateGetProductFilterSchema, getAllProducts);

export default router;
