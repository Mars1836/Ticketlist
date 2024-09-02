import { TicketCreatedEvent } from "@cl-ticket/common";
import { nat } from "../../../connect/nat";
import { TicketCreatedListener } from "../ticket_created_listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ticketModel } from "../../../models/ticket.model";
function setup() {
  const listener = new TicketCreatedListener(nat.client);
  const data: TicketCreatedEvent["data"] = {
    title: "test1",
    price: 12,
    userId: new mongoose.Types.ObjectId().toString(),
    id: new mongoose.Types.ObjectId().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 0,
  };
  // @ts-ignore
  const mes: Message = {
    ack: jest.fn(),
  };
  return { listener, data, mes };
}
it("should create ticket when ticket created listener get message", async () => {
  const { listener, data, mes } = setup();
  await listener.onMessage(data, mes);
  const ticket = await ticketModel.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
});
it("should call ack when ticket created listener handle success", async () => {
  const { listener, data, mes } = setup();
  await listener.onMessage(data, mes);
  expect(mes.ack).toHaveBeenCalled();
});
