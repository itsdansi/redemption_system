import express from "express";
import {isAuth} from "../middleware/isAuth";
import {getAllProducts, getProductsBySubCategory} from "../controller/product.controller";
import {validateGetProductFilterSchema} from "../validators/requests/product.requests";

const router = express.Router();

router.get("/", isAuth, validateGetProductFilterSchema, getAllProducts);
router.get("/get-by-subcategory", getProductsBySubCategory);

export default router;
