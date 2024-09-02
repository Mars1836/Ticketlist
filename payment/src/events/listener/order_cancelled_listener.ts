import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
import { Message } from "node-nats-streaming";
import { queueGroup } from "./queue_group";
import { orderModel } from "../../models/order.model";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
  queueGroup = queueGroup.PaymentService;
  async onMessage(
    data: {
      id: string;
      userId: string;
      status: OrderStatus;
      ticketRef: {
        id: string;
        price: number;
      };
      version: number;
      expiredAt: string;
    },
    mes: Message
  ): Promise<void> {
    try {
      const order = await orderModel.findOne({
        _id: data.id,
        version: data.version - 1,
      });
      if (!order) {
        throw new NotFoundError("Not found order");
      }
      order.set({ status: OrderStatus.Cancelled });
      await order.save();
      mes.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
