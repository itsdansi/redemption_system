import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {IRequestWithUser} from "../utils/type";
import {CartEntity} from "../entity/cart.entity";
import {OrderEntity} from "../entity/order.entity";
import {User2} from "../entity/user2.entity";
import {OrderItem} from "../entity/order-item.entity";
import {CartItem} from "../entity/cart-item.entity";
const nodemailer = require("nodemailer");

export const createOrder = async (
  req: IRequestWithUser<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    let {id} = req?.user;
    id = id ? id : 1;
    // let id = 684;
    const user = await getRepository(User2).findOne({where: {id}});
    const userCart = await getRepository(CartEntity).findOne({where: {user: {id}}});
    // console.log({userCart});
    if (user?.points < userCart.grandTotal) {
      return res.status(400).send({message: "Cart Amount Is Greater Than User Balance"});
    }
    if (!userCart.cartItems.length) {
      return res.status(404).send({message: "Cart Item Not Found"});
    }
    const newOrder = await getRepository(OrderEntity).save({
      user,
      shippingDetails: req.body.shippingDetails,
    });

    // console.log("Hello, you've spent:", {newOrder});
    await Promise.all(
      userCart.cartItems.map(async (item) => {
        await getRepository(OrderItem).save({...item, order: newOrder});
        await getRepository(CartItem).delete(item.id);
      })
    );
    user.points -= userCart.grandTotal;
    await getRepository(User2).save(user);
    const result = await getRepository(OrderEntity).findOne({
      where: {id: newOrder.id},
    });

    // send email to support team
    sendMailToSupportTeam(
      // "Somya.singh@nupipay.com",
      [
        "sales@nupipay.com",
        "accounts@suvidhaa.com",
        "imran.ibrahim@nupipay.com",
        "nilesh.gor@suvidhaa.com",
        "nihal.satam@nupipay.com",
      ],
      "Support Team",
      user,
      result,
      result.subTotal,
      result.createdAt
    );

    // send email to customer
    if (user.email) {
      sendMail(user.email, user?.party, result, result.subTotal, result.createdAt);
    }
    return res.status(201).send(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getUserOrderHistory = async (
  req: IRequestWithUser<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    let {id} = req?.user;
    id = id ? id : 1;
    const userOrders = await getRepository(OrderEntity).find({where: {user: {id}}});
    return res.status(200).send(userOrders);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const sendMail = async (receipient, party, order, points, createdAt) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "katuwalpujan@gmail.com",
      pass: "fgnkkurtvccaiumy",
    },
  });
  order.shippingDetails.addressLine1,
    order.shippingDetails.city,
    order.shippingDetails.state,
    order.shippingDetails.country;

  const mailOptions = {
    from: "katuwalpujan@gmail.com",
    to: receipient,
    subject: "You Order has been Confirmed",
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
    }
    
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    
    p {
      margin-bottom: 10px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    th, td {
      padding: 10px;
      border: 1px solid #ccc;
      text-align: left;
    }
    
    .order-summary th, .order-summary td {
      font-weight: bold;
    }
    
    .address {
      margin-bottom: 20px;
    }
    
    .signature {
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Dear ${party ?? "User"},</h1>
    
    <p>We have received your recent order having orderId ${
      order.id
    }, at Nichino store. Here are all the details:</p>
    
<table class="order-summary">
  <caption><h2>Order Summary:</h2></caption>
  <tr>
    <th>Product Name</th>
    <th>Order Date</th>
    <th>Quantity</th>
    <th>Points</th>
    <th>Total</th>
  </tr>
  ${order.orderItems
    .map(
      (item, index) => `
        <tr>
          <td>${item.name}</td>
          <td>${new Date(
            new Date(item.createdAt).getTime() + 6 * 60 * 60 * 1000
          ).toLocaleString("en-IN", {timeZone: "Asia/Kolkata"})}</td>
          <td>${item.quantity}</td>
          <td>${item.points}</td>
          <td>${item.quantity * item.points}</td>
        </tr>
          ${
            index === order.orderItems.length - 1
              ? `
          <tr>
            <td colspan="4">Subtotal</td>
            <td>${order.orderItems.reduce(
              (acc, curr) => acc + curr.quantity * curr.points,
              0
            )}</td>
          </tr>`
              : ""
          }
      `
    )
    .join("")}
</table>
<table class="order-summary">
  <caption><h2>Shipping Details:</h2></caption>
  <tr>
    <th>Address</th>
  </tr>
        <tr>
          <td> ${order.shippingDetails.addressLine1}, ${
      order.shippingDetails.addressLine2 ? order.shippingDetails.addressLine2 : "-"
    },  ${order.shippingDetails.pinCode},  ${order.shippingDetails.city}, ${
      order.shippingDetails.state
    }, ${order.shippingDetails.country}</td
        </tr>
</table> 
    
    <p>We are currently processing your order and will keep you updated on the status of your shipment. You can expect to receive a shipping confirmation email with tracking information once your order has been dispatched.</p>
    
    <p>If you have any questions or concerns about your order, please don’t hesitate to contact us. Our customer service team is always happy to assist you.</p>
    
    <p>Thank you for choosing us for your shopping needs. We look forward to serving you again in the future.</p>
    
    <div class="signature">
      <p>Best regards,</p>
      <p>Team Nichino</p>
    </div>
  </div>
</body>
</html>
`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const sendMailToSupportTeam = async (
  receipient,
  firstName,
  user,
  order,
  points,
  createdAt
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "katuwalpujan@gmail.com",
      pass: "fgnkkurtvccaiumy",
    },
  });
  order.shippingDetails.addressLine1,
    order.shippingDetails.city,
    order.shippingDetails.state,
    order.shippingDetails.country;

  const mailOptions = {
    from: "katuwalpujan@gmail.com",
    // to: receipient,
    to: receipient.join(", "),
    subject: "A new order has been confirmed!",
    html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
    }
    
    h1 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    
    p {
      margin-bottom: 10px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    th, td {
      padding: 10px;
      border: 1px solid #ccc;
      text-align: left;
    }
    
    .order-summary th, .order-summary td {
      font-weight: bold;
    }
    
    .address {
      margin-bottom: 20px;
    }
    
    .signature {
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Dear ${firstName ?? "Support Team"},</h1>
    
    <p>We have received a recent order at Nichino store. Here are all the details:</p>
    
<table class="order-summary">
  <caption><h2>Order Summary:</h2></caption>
  <tr>
    <th>Order Id </th>
    <th>Order Date</th>
    <th>SKU ID</th>
    <th>Product Name</th>
    <th>Quantity</th>
    <th>Points</th>
    <th>Total</th>
  </tr>
  ${order.orderItems
    .map(
      (item, index) => `
        <tr>
          <td>${item.id}</td>
          <td>${new Date(
            new Date(item.createdAt).getTime() + 6 * 60 * 60 * 1000
          ).toLocaleString("en-IN", {timeZone: "Asia/Kolkata"})}</td>

          <td>${item.sku}</td>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.points}</td>
          <td>${item.quantity * item.points}</td>
        </tr>
          ${
            index === order.orderItems.length - 1
              ? `
          <tr>
            <td colspan="6">Subtotal</td>
            <td>${order.orderItems.reduce(
              (acc, curr) => acc + curr.quantity * curr.points,
              0
            )}</td>
          </tr>`
              : ""
          }
      `
    )
    .join("")}
</table>

<table class="order-summary">
  <caption><h2>Customer Details:</h2></caption>
  <tr>
    <th>Party Name</th>
    <th>Phone</th>
    <th>Email</th>
    <th>User Type</th>
  </tr>
  <tr>
    <td>${user.party} </td>
    <td>${user.phone}</td>
    <td>${user.email}</td>
    <td>${user.userType}</td>
  </tr>
</table>

<table class="order-summary">
  <caption><h2>Shipping Details:</h2></caption>
  <tr>
    <th>Address</th>
  </tr>
        <tr>
          <td> ${order.shippingDetails.addressLine1}, ${
      order.shippingDetails.addressLine2 ? order.shippingDetails.addressLine2 : "-"
    },  ${order.shippingDetails.pinCode},  ${order.shippingDetails.city}, ${
      order.shippingDetails.state
    }, ${order.shippingDetails.country}</td
        </tr>
</table> 
<br>
    <div class="signature">
      <p>Best regards,</p>
      <p>Nichino System Bot</p>
    </div>
  </div>
</body>
</html>
`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
