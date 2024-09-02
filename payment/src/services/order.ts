import { OrderStatus } from "@cl-ticket/common";
import { orderModel } from "../models/order.model";

export const getExpiredTime = (): Date => {
  const now = new Date();
  return new Date(now.setSeconds(now.getSeconds() + 60));
};
const create = async (data: {
  id?: string;
  version?: number;
  price: number;
  userId: string;
  status: OrderStatus;
}) => {
  if (!data.id) {
    const order = await orderModel.create({
      ...data,
    });
    return order;
  }
  const order = await orderModel.create({
    _id: data.id,
    ...data,
  });
  return order;
};
export const orderSrv = {
  create,
};
