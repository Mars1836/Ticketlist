import { Request, Response } from "express";
import router from "./routes";
import { BadRequestError, handleError, verifyUser } from "@cl-ticket/common";
import { NotFoundError } from "@cl-ticket/common";
import cookieSession from "cookie-session";
import { handleAsync } from "@cl-ticket/common";
import cookieParser from "cookie-parser";
import cors from "cors";
import { constEnv } from "./configs/env";
import { stripe } from "./connect/stripe";
import path from "path";
import fs from "fs";
import { redis } from "./connect/redis";
import { getKeyPayment } from "./configs/getKey";
import { paymentSrv } from "./services/payment";
import { PaymentAttr } from "./models/payment.model";
import { PaymentCreatedPublisher } from "./events/publisher/payment_create_publisher";
import { nat } from "./connect/nat";

const express = require("express");
const app = express();
app.set("trust proxy", true);
app.use(cookieParser());
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleAsync(async (request: Request, response: Response) => {
    const sig = request.headers["stripe-signature"];
    if (!sig) {
      throw new BadRequestError("");
    }
    let event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      constEnv.stripeCliWebhookSercet!
    );
    const data: any = event.data.object;

    if (event.type !== "payment_intent.succeeded") {
      return response.send("");
    }
    const paymentStr = await redis.client.get(getKeyPayment(data.id));
    if (!paymentStr) {
      throw new Error("Payment is not found");
    }
    const payment: PaymentAttr = JSON.parse(paymentStr) as PaymentAttr;
    const p = await paymentSrv.create(payment);
    new PaymentCreatedPublisher(nat.client).publish({
      stripeId: p.stripeId,
      userId: p.userId,
      orderId: p.orderId,
      id: p.id,
    });
    response.send(event);
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  cookieSession({
    signed: false,
    // secure: true, // must be connect in https connection
  })
);
app.use(handleAsync(verifyUser));
app.use("/api/payments", router);

app.use(
  "*",
  handleAsync(() => {
    throw new NotFoundError();
  })
);
app.use(handleError);
export default app;
