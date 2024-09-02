import { OrderStatus } from "@cl-ticket/common";
import mongoose from "mongoose";
export interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
  id: string;
}
export interface OrderModel extends mongoose.Model<OrderDoc> {}
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
      required: true,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
orderSchema.set("versionKey", "version");
export const orderModel = mongoose.model<OrderDoc, OrderModel>(
  "order",
  orderSchema
);
