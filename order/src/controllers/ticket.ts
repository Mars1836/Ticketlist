import { validationResult } from "express-validator";
import { RequestValidationError } from "@cl-ticket/common";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { BadRequestError } from "@cl-ticket/common";
import jwt from "jsonwebtoken";
import { TicketAttr } from "../models/ticket.model";
import { ticketSrv } from "../services/ticket";
async function create(req: Request, res: Response) {
  const ticket: TicketAttr = { ...req.body, userId: req.user?.id };
  const rs = await ticketSrv.create(ticket);
  res.status(201).json(rs);
}
async function getById(req: Request, res: Response) {
  const id = req.params.id;
  const rs = await ticketSrv.getById(id);
  res.status(200).json(rs);
}
async function getAll(req: Request, res: Response) {
  const rs = await ticketSrv.getAll();
  res.status(200).json(rs);
}
async function update(req: Request, res: Response) {
  const payload: TicketAttr = { ...req.body, userId: req.user!.id };
  const id: string = req.params.id;
  const rs = await ticketSrv.update({ id, ...payload });
  res.status(200).json(rs);
}
export const ticketCtrl = {
  create,
  getById,
  getAll,
  update,
};
