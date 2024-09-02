import { Request, Response } from "express";

import { TicketAttr } from "../models/ticket.model";
import { ticketService } from "../services/ticket";
async function create(req: Request, res: Response) {
  const ticket: TicketAttr = { ...req.body, userId: req.user?.id };
  const rs = await ticketService.create(ticket);
  res.status(201).json(rs);
}
async function getById(req: Request, res: Response) {
  const id = req.params.id;
  const rs = await ticketService.getById(id);
  res.status(200).json(rs);
}
async function getAll(req: Request, res: Response) {
  const rs = await ticketService.getAll();
  res.status(200).json(rs);
}
async function update(req: Request, res: Response) {
  const payload: TicketAttr = { ...req.body, userId: req.user!.id };
  const id: string = req.params.id;
  const rs = await ticketService.update(id, payload);

  res.status(200).json(rs);
}
export const ticketCtrl = {
  create,
  getById,
  getAll,
  update,
};
