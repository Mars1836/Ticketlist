import {
  Listener,
  NotFoundError,
  OrderStatus,
  PaymentCreatedEvent,
} from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
import { Message } from "node-nats-streaming";
import { QueueName } from "./queue_name";
import { orderModel } from "../../models/order.model";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subject.PaymentCreated = Subject.PaymentCreated;
  queueGroup: string = QueueName.OrderService;
  async onMessage(
    data: { stripeId: string; userId: string; id: string; orderId: string },
    mes: Message
  ): Promise<void> {
    const order = await orderModel.findById(data.orderId);
    if (!order) {
      throw new NotFoundError("Order is not exist");
    }
    order.set({ status: OrderStatus.Finished });
    await order.save();
    // publish order updated if needed
    mes.ack();
  }
}
