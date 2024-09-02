import { NotFoundError } from "@cl-ticket/common";
import { BadRequestError } from "@cl-ticket/common";
import * as _ from "lodash";
import jwt from "jsonwebtoken";
import { TicketAttr, ticketModel } from "../models/ticket.model";
import { nat } from "../connect/nat";
async function create(payload: TicketAttr) {
  let ticket;

  if (payload.id) {
    ticket = await ticketModel.create({
      ...payload,
      _id: payload.id,
    });
  } else {
    ticket = await ticketModel.create({
      ...payload,
    });
  }
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
  const ticket = await ticketModel.find({});

  return ticket;
}
async function update(payload: {
  id: string;
  title?: string;
  price?: number;
  userId?: string;
}) {
  const ticket = await ticketModel.findOneAndUpdate(
    {
      userId: payload.userId,
      _id: payload.id,
    },
    {
      ...payload,
    },
    {
      new: true,
    }
  );
  if (!ticket) {
    throw new BadRequestError("Ticket is not found");
  }

  return ticket;
}
export const ticketSrv = {
  create,
  getById,
  getAll,
  update,
};
