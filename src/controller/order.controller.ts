import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { IRequestWithUser } from "../utils/type";
import { CartEntity } from "../entity/cart.entity";
import { OrderEntity } from "../entity/order.entity";
import { User2 } from "../entity/user2.entity";
import { OrderItem } from "../entity/order-item.entity";
import { CartItem } from "../entity/cart-item.entity";

export const createOrder = async (req: IRequestWithUser<any, any, any, any>, res: Response, next: NextFunction) => {
    try {
        let { id } = req?.user
        id = id ? id : 1
        const user = await getRepository(User2).findOne({ where: { id } })
        const userCart = await getRepository(CartEntity).findOne({ where: { user: { id } } })
      console.log(userCart.grandTotal)
        if(user?.points < userCart.grandTotal) {
            return res.status(400).send({message:'Cart Amount Is Greater Than User Balance'})
        }
        if (!userCart.cartItems.length) {
            return res.status(404).send({message:'Cart Item Not Found'})
        }
        const newOrder = await getRepository(OrderEntity).save({ user, shippingDetails: req.body.shippingDetails })

        await Promise.all(userCart.cartItems.map(async (item) => {
            await getRepository(OrderItem).save({ ...item, order: newOrder })
            await getRepository(CartItem).delete(item.id)
        }))
        user.points -=userCart.grandTotal
        await getRepository(User2).save(user)
        const result = await getRepository(OrderEntity).findOne({ where: { id: newOrder.id } })
        return res.status(201).send(result)
    } catch (err) {
        console.log(err)
        next(err)
    }
}

export const getUserOrderHistory = async (req: IRequestWithUser<any, any, any, any>, res: Response, next: NextFunction) => {
    try {
        let { id } = req?.user
        id = id ? id : 1
        const userOrders = await getRepository(OrderEntity).find({ where: { user: { id } } })
        return res.status(200).send(userOrders)
    } catch (err) {
        console.log(err)
        next(err)
    }
}
