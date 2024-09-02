import { BadRequestError, NotFoundError, OrderStatus } from "@cl-ticket/common";
import { OrderAttr, orderModel } from "../models/order.model";
import { ticketModel } from "../models/ticket.model";
import { OrderCancelledPublish } from "../events/publisher/order_cancelled_publisher";
import { nat } from "../connect/nat";
import { OrderCreatedPublish } from "../events/publisher/order_created_publisher";
export const getExpiredTime = (): Date => {
  const now = new Date();
  return new Date(now.setSeconds(now.getSeconds() + 1 * 60));
};
const create = async ({
  ticketId,
  userId,
}: {
  ticketId: string;
  userId: string;
}) => {
  const ticket = await ticketModel.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError("Ticket is not found.");
  }
  const isTicketReversed = await ticket.isReversed();
  if (isTicketReversed) {
    throw new BadRequestError("Ticket is already reversed.");
  }
  const order = await orderModel.create({
    ticketRef: ticket,
    userId,
    expiredAt: getExpiredTime(),
  });
  if (!order) {
    throw new BadRequestError("Something wrong!");
  }
  new OrderCreatedPublish(nat.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiredAt: order.expiredAt.toISOString(),
    version: order.version,
    ticketRef: {
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
    },
  });
  return order;
};
const getByUser = async (userId: string) => {
  const order = await orderModel
    .find({
      userId,
    })
    .populate("ticketRef")
    .sort({ createdAt: -1 });
  return order;
};
const remove = async ({
  orderId,
  userId,
}: {
  orderId: string;
  userId: string;
}) => {
  const order = await orderModel
    .findOne({ userId: userId, _id: orderId })
    .populate("ticketRef");
  if (!order) {
    throw new NotFoundError("Not found order");
  }
  await order.set({
    status: OrderStatus.Cancelled,
  });

  new OrderCancelledPublish(nat.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    ticketRef: { id: order.ticketRef.id, price: order.ticketRef.price },
    version: order.version,
    expiredAt: order.expiredAt.toISOString(),
  });
  return order;
};
const getById = async ({
  orderId,
  userId,
}: {
  orderId: string;
  userId: string;
}) => {
  const order = await orderModel
    .findOne({
      userId,
      _id: orderId,
    })
    .populate("ticketRef");
  return order;
};
export const orderSrv = {
  getByUser,
  create,
  remove,
  getById,
};
