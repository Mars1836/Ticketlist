import { NotFoundError } from "@cl-ticket/common";
import { BadRequestError } from "@cl-ticket/common";
import * as _ from "lodash";
import jwt from "jsonwebtoken";
import { Ticket, TicketAttr, ticketModel } from "../models/ticket.model";
import { TicketCreatedPublish } from "../events/publisher/ticket_create_publisher";
import { nat } from "../connect/nat";
import { TicketUpdatedPublish } from "../events/publisher/ticket_update_publisher";
async function create(payload: TicketAttr) {
  const ticket = await ticketModel.create(payload);
  new TicketCreatedPublish(nat.client).publish({
    price: ticket.price,
    title: ticket.title,
    userId: ticket.userId,
    id: ticket.id,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    version: ticket.version,
  });
  return ticket;
}
async function getById(id: string) {
  const ticket = await ticketModel.findById(id);
  if (!ticket) {
    throw new NotFoundError();
  }
  return ticket;
}
async function getAll() {
  const ticket = await ticketModel.find({ orderId: null });

  return ticket;
}
async function update(id: string, payload: TicketAttr) {
  const ticket = await ticketModel.findOne({
    userId: payload.userId,
    _id: id,
  });
  const version = ticket?.version;
  if (!ticket) {
    throw new BadRequestError("Ticket is not found");
  }
  if (ticket.orderId) {
    throw new BadRequestError("Can not update reserved ticket ");
  }
  ticket.set({
    title: payload.title,
    price: payload.price,
  });

  const newTicket = await ticket.save();

  if (newTicket.version === version) {
    throw new BadRequestError("Ticket doesn't change");
  }
  new TicketUpdatedPublish(nat.client).publish({
    id: newTicket.id,
    title: newTicket.title,
    price: newTicket.price,
    version: newTicket.version,
    updatedAt: newTicket.updatedAt.toISOString(),
    userId: newTicket.userId,
    orderId: newTicket.orderId,
  });
  return newTicket;
}
export const ticketService = {
  create,
  getById,
  getAll,
  update,
};
