import {
  OrderCreatedEvent,
  OrderStatus,
  TicketCreatedEvent,
} from "@cl-ticket/common";
import { nat } from "../../../connect/nat";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedListener } from "../order_create_listener";
import { Subject } from "@cl-ticket/common/build/events/subject";
import { getExpiredTime } from "../../../services/order";
import { orderModel } from "../../../models/order.model";

async function setup() {
  const listener = new OrderCreatedListener(nat.client);
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toString(),
    userId: new mongoose.Types.ObjectId().toString(),
    status: OrderStatus.Created,
    ticketRef: {
      id: new mongoose.Types.ObjectId().toString(),
      title: "title of ticket",
      price: 200,
      userId: new mongoose.Types.ObjectId().toString(),
    },
    version: 0,
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
  expect(mes.ack).toHaveBeenCalled();
});
