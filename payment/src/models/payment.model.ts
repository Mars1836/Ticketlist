import mongoose from "mongoose";
const { Schema } = mongoose;
export interface PaymentAttr {
  stripeId: string;
  userId: string;
  orderId: string;
}

export interface PaymentDoc extends mongoose.Document {
  stripeId: string;
  userId: string;
  orderId: string;
}
export interface PaymentModel extends mongoose.Model<PaymentDoc> {
  stripeId: string;
  userId: string;
  orderId: string;
}
const paymentSchema = new Schema(
  {
    stripeId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

export const paymentModel = mongoose.model<PaymentDoc, PaymentModel>(
  "payment",
  paymentSchema
);
