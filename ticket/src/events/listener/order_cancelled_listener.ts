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
import { ticketModel } from "../../models/ticket.model";
import { TicketUpdatedPublish } from "../publisher/ticket_update_publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
  queueGroup = queueGroup.TicketService;
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
      const ticket = await ticketModel.findOne({ _id: data.ticketRef.id });
      if (!ticket) {
        throw new NotFoundError("Ticket is not found");
      }
      ticket.set({
        orderId: null,
      });
      await ticket.save();
      new TicketUpdatedPublish(this.stan).publish({
        id: ticket.id,
        version: ticket.version,
        updatedAt: ticket.updatedAt.toISOString(),
        price: ticket.price,
        title: ticket.title,
        orderId: ticket.orderId,
        userId: ticket.userId,
      });
      mes.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
