import mongoose from "mongoose";
const { Schema } = mongoose;
export interface TicketAttr {
  title: string;
  price: number;
  userId: string;
  version?: number;
}
export interface Ticket extends TicketAttr {
  id: string;
}
export interface TicketDoc extends mongoose.Document {
  id: string;
  title: string;
  price: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  orderId: string;
}
export interface TicketModel extends mongoose.Model<TicketDoc> {}
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
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
ticketSchema.set("versionKey", "version");

export const ticketModel = mongoose.model<TicketDoc, TicketModel>(
  "ticket",
  ticketSchema
);
