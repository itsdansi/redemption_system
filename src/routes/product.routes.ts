import express from "express";
import {isAuth} from "../middleware/isAuth";
import {
  getAllCategory,
  getAllProducts,
  getProductsBySubCategory,
  getSingleProduct,
} from "../controller/product.controller";
import {validateGetProductFilterSchema} from "../validators/requests/product.requests";

const router = express.Router();

router.get("/", isAuth, getAllProducts);
router.get("/get-by-subcategory", isAuth, getProductsBySubCategory);
router.get("/get-all-categories", isAuth, getAllCategory);
router.get("/get-single-product/:id", isAuth, getSingleProduct);

export default router;
