import {
  ExpirationOrderHandledEvent,
  Listener,
  NotFoundError,
  OrderStatus,
} from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
import { Message } from "node-nats-streaming";
import { QueueName } from "./queue_name";
import { orderModel } from "../../models/order.model";
import { OrderCancelledPublish } from "../publisher/order_cancelled_publisher";
import { nat } from "../../connect/nat";

export class ExpirationOrderHandledListener extends Listener<ExpirationOrderHandledEvent> {
  subject: Subject.ExpirationOrderHandled = Subject.ExpirationOrderHandled;
  queueGroup: string = QueueName.OrderService;
  async onMessage(data: { orderId: string }, mes: Message): Promise<void> {
    try {
      const order = await orderModel
        .findById(data.orderId)
        .populate("ticketRef");
      if (!order) {
        throw new NotFoundError("Order is not found in order expiration event");
      }
      if (order.status === OrderStatus.Finished) {
        return mes.ack();
      }
      order.set({
        status: OrderStatus.Cancelled,
      });
      await order.save();
      await new OrderCancelledPublish(nat.client).publish({
        id: order.id,
        userId: order.userId,
        status: order.status,
        ticketRef: {
          id: order.ticketRef.id,
          price: order.ticketRef.price,
        },
        version: order.version,
        expiredAt: order.expiredAt.toISOString(),
      });
      mes.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
