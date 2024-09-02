import {
  Listener,
  NotFoundError,
  OrderCreatedEvent,
  OrderStatus,
} from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
import { Message } from "node-nats-streaming";
import { queueGroup } from "./queue_group";
import { ticketModel } from "../../models/ticket.model";
import { TicketUpdatedPublish } from "../publisher/ticket_update_publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;

  queueGroup: string = queueGroup.TicketService;
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
      const ticket = await ticketModel.findById(data.ticketRef.id);
      if (!ticket) {
        throw new NotFoundError("Ticket is not found ");
      }
      ticket.set({
        orderId: data.id,
      });
      const newTicket = await ticket.save();
      new TicketUpdatedPublish(this.stan).publish({
        id: newTicket.id,
        version: newTicket.version,
        orderId: newTicket.orderId,
        price: newTicket.price,
        title: newTicket.title,
        userId: newTicket.userId,
        updatedAt: newTicket.updatedAt.toISOString(),
      });
      mes.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
