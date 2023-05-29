import { NextFunction, Request, Response } from "express";
import { getRepository, } from "typeorm";
import { CartEntity } from "../entity/cart.entity";
import { IRequestWithUser } from "../utils/type";
import { CartItem } from "../entity/cart-item.entity"
import { User2 } from "../entity/user2.entity";


export const getCart = async (req: IRequestWithUser<any, any, any, any>, res: Response, next: NextFunction) => {
    try {
        let { id } = req?.user
        const user = await getRepository(User2).findOne({ where: { id } })
        let userCart
        userCart = await getRepository(CartEntity).findOne({ where: { user: { id } } })
        if (!userCart) {
            userCart = await getRepository(CartEntity).save({ user })
        }
        let updatedCartResponse = await getRepository(CartEntity).createQueryBuilder('cart')
            .leftJoin('cart.user', 'user')
            .leftJoinAndSelect('cart.cartItems', 'cartItems')
            .where('user.id=:id', { id })
            .orderBy('cartItems.createdAt', 'DESC')
            .getOne()
        res.status(200).send(updatedCartResponse)
    } catch (err) {
        console.log(err)
        next(err)
    }
}

export const addItemToCart = async (req: IRequestWithUser<any, any, any, any>, res: Response, next: NextFunction) => {
    try {
        let { id } = req?.user
        const userCart = await getRepository(CartEntity).findOne({ where: { user: { id } } })
        const checkCartItem = await getRepository(CartItem).findOne({ where: { sku: req.body.sku, cart: { user: { id } } } })
        if (checkCartItem) {
            checkCartItem.quantity += req.body.quantity
            await getRepository(CartItem).save(checkCartItem)
        }
        else {
            let newCartItem = await getRepository(CartItem).save({ ...req.body, cart: userCart })
            console.log(newCartItem)
        }
        let updatedCartResponse = await getRepository(CartEntity).createQueryBuilder('cart')
            .leftJoin('cart.user', 'user')
            .leftJoinAndSelect('cart.cartItems', 'cartItems')
            .where('user.id=:id', { id })
            .orderBy('cartItems.createdAt', 'DESC')
            .getOne()
        res.status(201).send(updatedCartResponse)
    } catch (err) {
        next(err)
    }

}

export const updateCartItem = async (req: IRequestWithUser<any, any, any, any>, res: Response, next: NextFunction) => {
    try {
        let { id } = req?.user
        const { sku, quantity } = req.body
        const userCart = await getRepository(CartEntity).findOne({ where: { user: { id } } })
        const cartItem = await getRepository(CartItem).findOne({ where: { sku, cart: { user: { id } } } })
        if (!cartItem) {
            return res.status(404).send({ message: 'Cart Item Not Found' })
        }
        if (quantity) {
            cartItem.quantity = quantity
            await getRepository(CartItem).save(cartItem)
        } else {
            if (quantity === 0) {
                await getRepository(CartItem).delete(cartItem.id)
            }
            else {
                cartItem.quantity += 1
                await getRepository(CartItem).save(cartItem)
            }
        }
        
        let updatedCartResponse = await getRepository(CartEntity).createQueryBuilder('cart')
            .leftJoin('cart.user', 'user')
            .leftJoinAndSelect('cart.cartItems', 'cartItems')
            .where('user.id=:id', { id })
            .orderBy('cartItems.createdAt', 'DESC')
            .getOne()
        res.status(201).send(updatedCartResponse)
    } catch (err) {
        next(err)
    }

}

export const deleteCartItems = async (req: IRequestWithUser<any, any, any, any>, res: Response, next: NextFunction) => {
   try {
    let { id } = req?.user
    const { sku } = req.params
    const cartItem = await getRepository(CartItem).findOne({ where: { sku, cart: { user: { id } } } })
    if (!cartItem) {
        return res.status(404).send({mesage: 'Cart Item Not Found'})
    }
    await getRepository(CartItem).delete(cartItem.id)
    let updatedCartResponse = await getRepository(CartEntity).createQueryBuilder('cart')
        .leftJoin('cart.user', 'user')
        .leftJoinAndSelect('cart.cartItems', 'cartItems')
        .where('user.id=:id', { id })
        .orderBy('cartItems.createdAt', 'DESC')
        .getOne()
    res.status(201).send(updatedCartResponse)
   } catch (error) {
    res.status(500).send({message:'Internal Server Error',error})
   }
}