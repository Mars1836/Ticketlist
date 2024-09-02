import {
  BadRequestError,
  handleAsync,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validate_request,
} from "@cl-ticket/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { orderModel } from "../models/order.model";
import Stripe from "stripe";
import { stripe } from "../connect/stripe";
import { paymentSrv } from "../services/payment";
import { PaymentCreatedPublisher } from "../events/publisher/payment_create_publisher";
import { nat } from "../connect/nat";
import { constEnv } from "../configs/env";
import { redis } from "../connect/redis";
import { getKeyPayment } from "../configs/getKey";
import { PaymentAttr } from "../models/payment.model";
const router = express.Router();

router.post(
  "/create-payment-intent",
  handleAsync(requireAuth),
  [body("orderId").notEmpty().withMessage("orderId is not found")],
  handleAsync(validate_request),
  handleAsync(async (req: Request, res: Response) => {
    const { orderId } = req.body;
    const order = await orderModel.findOne({
      _id: orderId,
    });
    if (!order) {
      throw new NotFoundError("The order is not available for payment");
    }
    if (req.user?.id !== order.userId) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("The order is cancelled");
    }
    if (order.status === OrderStatus.Finished) {
      throw new BadRequestError("The order was alrealy paid");
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: "usd",
    });
    const data: PaymentAttr = {
      orderId,
      stripeId: paymentIntent.id,
      userId: req.user?.id!,
    };
    redis.client.set(getKeyPayment(paymentIntent.id), JSON.stringify(data), {
      EX: 60 * 20,
      NX: true,
    });
    res.status(200).send(paymentIntent);
  })
);

// router.post(
//   "/",
//   handleAsync(requireAuth),
//   [
//     body("token").notEmpty().withMessage("Token is required to provide"),
//     body("orderId").notEmpty().withMessage("OrderId is required to provide"),
//   ],

//   handleAsync(validate_request),
//   handleAsync(async (req: Request, res: Response) => {
//     const { token, orderId } = req.body;

//     const order = await orderModel.findById(orderId);
//     if (!order) {
//       throw new NotFoundError("Order is not exist");
//     }

//     if (req.user?.id !== order.userId) {
//       throw new NotAuthorizedError();
//     }
//     if (order.status === OrderStatus.Cancelled) {
//       throw new BadRequestError("Can't handled payment for cancelled order");
//     }

//     const charge = await stripe.charges.create({
//       currency: "usd",
//       amount: order.price * 100,
//       source: token,
//     });
//     order.set({ status: OrderStatus.Finished });
//     await order.save();
//     const payment = await paymentSrv.create({
//       stripeId: charge.id,
//       userId: req.user.id,
//       orderId: order.id,
//     });
//     await new PaymentCreatedPublisher(nat.client).publish({
//       stripeId: payment.stripeId,
//       userId: payment.userId,
//       orderId: payment.orderId,
//       id: payment.id,
//     });
//     res.status(200).json(charge);
//   })
// );

export default router;
