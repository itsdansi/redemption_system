import express from 'express';
import {isAuth} from '../middleware/isAuth';
import { addItemToCart, deleteCartItems, getCart, updateCartItem } from '../controller/cart.controller';

const router = express.Router();

router.get('/get', isAuth, getCart);
router.post('/item', isAuth,addItemToCart)
router.put('/item/',isAuth,updateCartItem)
router.delete('/item/:sku',isAuth,deleteCartItems)
export default router;
