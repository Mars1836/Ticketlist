import { Request, Response } from "express";
import { OrderAttr } from "../models/order.model";
import { orderSrv } from "../services/order";

const create = async (req: Request, res: Response) => {
  const rs = await orderSrv.create({
    ticketId: req.body.ticketId,
    userId: req.user!.id,
  });
  res.status(201).json(rs);
};
const getByUser = async (req: Request, res: Response) => {
  const rs = await orderSrv.getByUser(req.user!.id);
  res.status(200).json(rs);
};
const getById = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const rs = await orderSrv.getById({ userId: req.user!.id, orderId: orderId });
  res.status(200).json(rs);
};
const remove = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const userId = req.user!.id;
  const rs = await orderSrv.remove({ orderId, userId });
  res.status(200).json(rs);
};
export const orderCtrl = { create, getByUser, remove, getById };
