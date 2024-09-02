import { OrderCreatedEvent, OrderStatus } from "@cl-ticket/common";
import { nat } from "../../../connect/nat";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { getExpiredTime, orderSrv } from "../../../services/order";
import { orderModel } from "../../../models/order.model";
import { OrderCancelledListener } from "../order_cancelled_listener";

async function setup() {
  const userId = new mongoose.Types.ObjectId().toString();
  const order = await orderSrv.create({
    id: new mongoose.Types.ObjectId().toString(),
    price: 100,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toString(),
  });
  const listener = new OrderCancelledListener(nat.client);
  const data: OrderCreatedEvent["data"] = {
    id: order.id,
    userId: order.userId,
    status: OrderStatus.Cancelled,
    ticketRef: {
      id: new mongoose.Types.ObjectId().toString(),
      title: "title of ticket",
      price: order.price,
      userId: new mongoose.Types.ObjectId().toString(),
    },
    version: order.version + 1,
    expiredAt: getExpiredTime().toISOString(),
  };
  // @ts-ignore
  const mes: Message = {
    ack: jest.fn(),
  };
  return { listener, data, mes };
}
it("should create new order in of get order created listener", async () => {
  const { listener, data, mes } = await setup();
  await listener.onMessage(data, mes);
  const order = await orderModel.findById(data.id);
  expect(order).toBeDefined();
});
it("should call ack fn ", async () => {
  const { listener, data, mes } = await setup();
  await listener.onMessage(data, mes);
  const order = await orderModel.findById(data.id);
  expect(order!.status).toEqual(OrderStatus.Cancelled);
  expect(mes.ack).toHaveBeenCalled();
});
