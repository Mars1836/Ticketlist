import { PaymentAttr, paymentModel } from "../models/payment.model";

async function create(data: PaymentAttr) {
  const payment = await paymentModel.create(data);
  return payment;
}
export const paymentSrv = {
  create,
};
