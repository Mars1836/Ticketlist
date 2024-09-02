import { TicketCreatedEvent, TicketUpdatedEvent } from "@cl-ticket/common";
import { nat } from "../../../connect/nat";
import { TicketCreatedListener } from "../ticket_created_listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { TicketDoc, ticketModel } from "../../../models/ticket.model";
import { TicketUpdatedListener } from "../ticket_updated_listener";
function setup({ id, nVersion }: { id: string; nVersion: number }) {
  const listener = new TicketUpdatedListener(nat.client);

  const data: TicketUpdatedEvent["data"] = {
    title: "New title",
    price: 123,
    id: id,
    updatedAt: new Date().toISOString(),
    version: nVersion,
    userId: mongoose.Types.ObjectId.toString(),
    orderId: "",
  };
  // @ts-ignore
  const mes: Message = {
    ack: jest.fn(),
  };
  return { listener, data, mes };
}

it("should call ack and update ticket when ticket updated listener handle success", async () => {
  const ticket = await ticketModel.create({
    title: "test1",
    price: 12,
    userId: new mongoose.Types.ObjectId().toString(),
    id: new mongoose.Types.ObjectId().toString(),
    updatedAt: new Date().toISOString(),
  });

  const { listener, data, mes } = setup({
    id: ticket.id,
    nVersion: ticket.version + 1,
  });
  await listener.onMessage(data, mes);
  const ticketCheck = await ticketModel.findById(ticket.id);
  expect(ticketCheck).toBeDefined();
  expect(ticketCheck?.title).toEqual("New title");
  expect(ticketCheck?.price).toEqual(123);
  expect(ticketCheck?.version).toEqual(ticket.version + 1);
  expect(mes.ack).toHaveBeenCalled();
});
it("should call throw error when ticket updated listener handle get conflic version", async () => {
  const ticket = await ticketModel.create({
    title: "test1",
    price: 12,
    userId: new mongoose.Types.ObjectId().toString(),
    id: new mongoose.Types.ObjectId().toString(),
    updatedAt: new Date().toISOString(),
  });

  const { listener, data, mes } = setup({
    id: ticket.id,
    nVersion: ticket.version + 2,
  });
  try {
    await listener.onMessage(data, mes);
  } catch (error) {}
  expect(mes.ack).not.toHaveBeenCalled();
});
