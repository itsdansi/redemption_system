import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { IRequestWithUser } from "../utils/type";
import { CartEntity } from "../entity/cart.entity";
import { OrderEntity } from "../entity/order.entity";
import { User2 } from "../entity/user2.entity";
import { OrderItem } from "../entity/order-item.entity";
import { CartItem } from "../entity/cart-item.entity";
const nodemailer = require('nodemailer')

export const createOrder = async (req: IRequestWithUser<any, any, any, any>, res: Response, next: NextFunction) => {
    try {
        let { id } = req?.user
        id = id ? id : 1
        const user = await getRepository(User2).findOne({ where: { id } })
        const userCart = await getRepository(CartEntity).findOne({ where: { user: { id } } })
        // console.log(userCart.grandTotal)
        if (user?.points < userCart.grandTotal) {
            return res.status(400).send({ message: 'Cart Amount Is Greater Than User Balance' })
        }
        if (!userCart.cartItems.length) {
            return res.status(404).send({ message: 'Cart Item Not Found' })
        }
        const newOrder = await getRepository(OrderEntity).save({ user, shippingDetails: req.body.shippingDetails })

        await Promise.all(userCart.cartItems.map(async (item) => {
            await getRepository(OrderItem).save({ ...item, order: newOrder })
            await getRepository(CartItem).delete(item.id)
        }))
        user.points -= userCart.grandTotal
        await getRepository(User2).save(user)
        if(user.email) {sendMail(user.email,newOrder.id,newOrder.subTotal,newOrder.createdAt)}
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

export const sendMail = async (receipient,orderId,points, createdAt) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'katuwalpujan@gmail.com',
            pass: 'fgnkkurtvccaiumy'
        }
    });
    const mailOptions = {
        from: 'katuwalpujan@gmail.com',
        to: receipient,
        subject: 'You Order has been Confirmed',
        text:`Your Order with Id ${orderId} was Placed successfully with cost of ${points}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
