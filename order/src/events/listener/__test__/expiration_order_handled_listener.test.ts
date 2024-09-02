import {
  ExpirationOrderHandledEvent,
  OrderStatus,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from "@cl-ticket/common";
import { nat } from "../../../connect/nat";
import { TicketCreatedListener } from "../ticket_created_listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketDoc, ticketModel } from "../../../models/ticket.model";
import { TicketUpdatedListener } from "../ticket_updated_listener";
import { ExpirationOrderHandledListener } from "../expiration_order_handled_listener";
import { orderModel } from "../../../models/order.model";
import { getExpiredTime } from "../../../services/order";
import { Subject } from "@cl-ticket/common/build/events/subject";
async function setup() {
  const listener = new ExpirationOrderHandledListener(nat.client);
  const ticket = await ticketModel.create({
    title: "test1",
    price: 12,
    userId: new mongoose.Types.ObjectId().toString(),
    id: new mongoose.Types.ObjectId().toString(),
    updatedAt: new Date().toISOString(),
  });
  const order = await orderModel.create({
    userId: mongoose.Types.ObjectId.toString(),
    ticketRef: ticket.id,
    status: OrderStatus.Created,
    expiredAt: getExpiredTime(),
  });
  const data: ExpirationOrderHandledEvent["data"] = {
    orderId: order.id,
  };
  // @ts-ignore
  const mes: Message = {
    ack: jest.fn(),
  };
  return { listener, data, mes };
}

it("should update order status to cancelled", async () => {
  const { listener, data, mes } = await setup();
  expect(data.orderId).toBeDefined();
  await listener.onMessage(data, mes);
  const order = await orderModel.findById(data.orderId);
  expect(order).toBeDefined();
  expect(order!.status).toEqual(OrderStatus.Cancelled);
});
it("should publish order cancelled", async () => {
  const { listener, data, mes } = await setup();
  expect(data.orderId).toBeDefined();
  await listener.onMessage(data, mes);
  const fnMock = nat.client.publish as jest.Mock;
  expect(fnMock.mock.calls[0][0]).toEqual(Subject.OrderCancelled);
});
it("should call ack fn", async () => {
  const { listener, data, mes } = await setup();
  expect(data.orderId).toBeDefined();
  await listener.onMessage(data, mes);
  expect(mes.ack).toHaveBeenCalled();
});
