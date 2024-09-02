import mongoose from "mongoose";
import { TicketDoc } from "./ticket.model";
import { OrderStatus } from "@cl-ticket/common";
export { OrderStatus };
export interface OrderAttr {
  userId: string;
  status: OrderStatus;
  ticketId: string;
}
export interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  ticketRef: TicketDoc;
  expiredAt: Date;
  version: number;
}
export interface OrderModel extends mongoose.Model<OrderDoc> {}
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
      required: true,
    },
    ticketRef: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "ticket",
    },
    expiredAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    optimisticConcurrency: true,
  }
);
orderSchema.set("versionKey", "version");
export const orderModel = mongoose.model<OrderDoc, OrderModel>(
  "order",
  orderSchema
);
