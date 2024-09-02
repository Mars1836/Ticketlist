import mongoose from "mongoose";
import { orderModel, OrderStatus } from "./order.model";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
const { Schema } = mongoose;
export interface TicketAttr {
  id?: string;
  title: string;
  price: number;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  isReversed(): Promise<boolean>;
  version: number;
  createdAt: string;
  updatedAt: string;
}
export interface TicketModel extends mongoose.Model<TicketDoc> {
  id: string;
}
const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    // collection: "user_collection",
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
ticketSchema.set("versionKey", "version");
ticketSchema.methods.isReversed = async function () {
  const order = await orderModel.findOne({
    ticketRef: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.WaitingPayment,
        OrderStatus.Finished,
      ],
    },
  });
  return !!order;
};

export const ticketModel = mongoose.model<TicketDoc, TicketModel>(
  "ticket",
  ticketSchema
);
