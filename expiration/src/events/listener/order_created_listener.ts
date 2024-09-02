import { Listener, OrderCreatedEvent, OrderStatus } from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
import { Message } from "node-nats-streaming";
import { queueGroup } from "./queueGroup";
import { expireQueue } from "../../queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
  queueGroup = queueGroup.ExpirationService;
  onMessage(
    data: {
      id: string;
      userId: string;
      status: OrderStatus;
      ticketRef: { id: string; title: string; price: number; userId: string };
      version: number;
      expiredAt: string;
    },
    mes: Message
  ): void {
    const timeToExpired =
      new Date(data.expiredAt).getTime() - new Date().getTime();
    console.log("timeToExpired: ", timeToExpired);
    expireQueue.add(
      { orderId: data.id },
      {
        delay: timeToExpired,
      }
    );

    mes.ack();
  }
}
