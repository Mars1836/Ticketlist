import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { orderSrv } from "../../services/order";
import { OrderStatus } from "@cl-ticket/common";
import { orderModel } from "../../models/order.model";
import { stripe } from "../../connect/stripe";
import { paymentModel } from "../../models/payment.model";
import { redis } from "../../connect/redis";
import { getIdPaymentFromKey } from "../../configs/getKey";
async function createOrder() {
  const random = Math.floor(Math.random() * 1000 + 10) / 10;
  const order = await orderSrv.create({
    price: random,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toString(),
  });
  return order;
}
it("should return status 400 if orderId is not provide", async () => {
  await request(app)
    .post("/api/payments/create-payment-intent")
    .set("Cookie", global.login())
    .expect(400);
});

it("should return status 401 if not authenticated", async () => {
  await request(app)
    .post("/api/payments/create-payment-intent")
    .send({
      orderId: new mongoose.Types.ObjectId().toString(),
    })
    .expect(401);
});
it("should return status 404 if orderId is not exist", async () => {
  await request(app)
    .post("/api/payments/create-payment-intent")
    .send({
      orderId: new mongoose.Types.ObjectId().toString(),
    })
    .set("Cookie", global.login())
    .expect(404);
});
it("should return status 401 if userId is valid", async () => {
  const order = await createOrder();
  const check = await orderModel.findById(order.id);
  expect(check).toBeDefined();
  await request(app)
    .post("/api/payments/create-payment-intent")
    .send({
      orderId: order.id,
    })
    .set("Cookie", global.login())
    .expect(401);
});
it("should return status 400 if orderId is cancelled", async () => {
  const order = await createOrder();
  const checkOrder = await orderModel.findById(order.id);
  expect(checkOrder).toBeDefined();
  checkOrder?.set({ status: OrderStatus.Cancelled });
  await checkOrder!.save();
  await request(app)
    .post("/api/payments/create-payment-intent")
    .send({
      orderId: order.id,
    })
    .set("Cookie", global.login(order.userId))
    .expect(400);
  checkOrder?.set({ status: OrderStatus.Finished });
  await checkOrder!.save();
  await request(app)
    .post("/api/payments/create-payment-intent")
    .send({
      orderId: order.id,
    })
    .set("Cookie", global.login(order.userId))
    .expect(400);
});
it("should return status 200 if payment success", async () => {
  const order = await createOrder();
  const checkOrder = await orderModel.findById(order.id);
  expect(checkOrder).toBeDefined();

  await request(app)
    .post("/api/payments/create-payment-intent")
    .send({
      orderId: order.id,
    })
    .set("Cookie", global.login(order.userId))
    .expect(200);
  // const paymentIntents = await stripe.paymentIntents.list({
  //   limit: 5,
  // });
  expect(stripe.paymentIntents.create).toHaveBeenCalled();
  const calls = (redis.client.set as jest.Mock).mock.calls;
  const data = calls[0];
  const intentPaymentId = getIdPaymentFromKey(data[0]);
  const paymentAttr = JSON.parse(data[1]);
  expect(intentPaymentId).toBeDefined();
  expect(paymentAttr).toBeDefined();
  // const testIntentPayment = paymentIntents.data.find((item) => {
  //   return item.id === intentPaymentId;
  // });
  // expect(testIntentPayment).toBeDefined();
  expect(paymentAttr.orderId).toEqual(order.id);
});
