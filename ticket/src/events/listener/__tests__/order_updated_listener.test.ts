import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
  TicketCreatedEvent,
} from "@cl-ticket/common";
import { nat } from "../../../connect/nat";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ticketModel } from "../../../models/ticket.model";
import { ticketService } from "../../../services/ticket";
import { Subject } from "@cl-ticket/common/build/events/subject";
import { OrderCancelledListener } from "../order_cancelled_listener";
const getExpiredTime = (): Date => {
  const now = new Date();
  return new Date(now.setSeconds(now.getSeconds() + 15 * 60));
};

async function setup() {
  const userId = new mongoose.Types.ObjectId().toString();
  const ticket = await ticketService.create({
    price: 213,
    title: "dead",
    userId,
  });

  const listener = new OrderCancelledListener(nat.client);
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toString(),
    userId: new mongoose.Types.ObjectId().toString(),
    status: OrderStatus.Cancelled,
    ticketRef: {
      id: ticket.id,
      price: ticket.price,
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
it("should update ticket orderid to reserve when order cancelled listener get message and ack fn should be call", async () => {
  const { listener, data, mes } = await setup();
  await listener.onMessage(data, mes);
  const ticket = await ticketModel.findById(data.ticketRef.id);

  expect(ticket).toBeDefined();
  expect(ticket!.orderId).toEqual(null);
  expect(nat.client.publish).toHaveBeenCalled();
  expect(mes.ack).toHaveBeenCalled();
});
// it("should publish ticket update ", async () => {
//   const { listener, data, mes } = await setup();
//   await listener.onMessage(data, mes);
//   expect(nat.client.publish).toHaveBeenCalled();

//   const listCall = (nat.client.publish as jest.Mock).mock.calls;
//   const update = listCall.find((item) => {
//     return item[0] === Subject.TicketUpdated;
//   });
//   expect(update).toBeDefined();
//   const ticketUpdate = JSON.parse(update[1]);
//   expect(ticketUpdate.id).toEqual(data.ticketRef.id);
// });
