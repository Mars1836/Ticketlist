import {
  InternalError,
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  OrderStatus,
} from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
import { Message } from "node-nats-streaming";
import { queueGroup } from "./queue_group";
import { orderModel } from "../../models/order.model";
import { orderSrv } from "../../services/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;

  queueGroup: string = queueGroup.PaymentService;
  async onMessage(
    data: {
      id: string;
      userId: string;
      status: OrderStatus;
      ticketRef: { id: string; title: string; price: number; userId: string };
      version: number;
      expiredAt: string;
    },
    mes: Message
  ): Promise<void> {
    try {
      const order = await orderSrv.create({
        id: data.id,
        price: data.ticketRef.price,
        status: data.status,
        userId: data.userId,
        version: data.version,
      });

      if (!order) {
        throw new InternalError("Order payment created failed");
      }
      mes.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
