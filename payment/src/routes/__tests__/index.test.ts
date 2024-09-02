import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { orderSrv } from "../../services/order";
import { OrderStatus } from "@cl-ticket/common";
import { orderModel } from "../../models/order.model";
import { stripe } from "../../connect/stripe";
import { paymentModel } from "../../models/payment.model";
async function createOrder() {
  const random = Math.floor(Math.random() * 1000 + 10) / 10;
  const order = await orderSrv.create({
    price: random,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toString(),
  });
  return order;
}
it("should return status 400 if orderId or token is not provided", async () => {
  await request(app)
    .post("/api/payments")
    .send({
      token: "asds",
    })
    .set("Cookie", global.login())
    .expect(400);
  await request(app)
    .post("/api/payments")
    .send({
      orderId: "asds",
    })
    .set("Cookie", global.login())
    .expect(400);
});

it("should return status 401 if not authenticated", async () => {
  await request(app)
    .post("/api/payments")
    .send({
      token: "asds",
      orderId: "asdas;",
    })
    .expect(401);
});
it("should return status 404 if orderId is not exist in db", async () => {
  await request(app)
    .post("/api/payments")
    .send({
      token: "asds",
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
    .post("/api/payments")
    .send({
      token: "asds",
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
    .post("/api/payments")
    .send({
      token: "asds",
      orderId: order.id,
    })
    .set("Cookie", global.login(order.userId))
    .expect(400);
});
it("should return status 200 if payment success", async () => {
  const order = await createOrder();
  const checkOrder = await orderModel.findById(order.id);
  expect(checkOrder).toBeDefined();
  //   const calls = stripe.charges.create({
  //     currency: "usd",
  //     amount: 50,
  //     source: "tok_visa",
  //   });
  await request(app)
    .post("/api/payments")
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .set("Cookie", global.login(order.userId))
    .expect(200);
  // const calls = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  const stripCharges = await stripe.charges.list({
    limit: 20,
  });
  const recentCharges = stripCharges.data.find((item) => {
    return item.amount === order.price * 100;
  });

  expect(recentCharges).toBeDefined();
  const payment = await paymentModel.findOne({
    userId: order.userId,
    stripeId: recentCharges?.id,
  });
  console.log(payment);
  expect(payment).toBeDefined();
  // expect(calls.source).toEqual("tok_visa");
  // expect(calls.amount).toEqual(order.price * 100);
  // expect(calls.currency).toEqual("usd");
  expect(1).toEqual(1);
});
