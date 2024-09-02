import {
  BadRequestError,
  Listener,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
import { Message } from "node-nats-streaming";
import { ticketSrv } from "../../services/ticket";
import { update } from "lodash";
import { ticketModel } from "../../models/ticket.model";
import { QueueName } from "./queue_name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  async onMessage(
    data: {
      title?: string;
      price?: number;
      userId?: string;
      orderId?: string;
      id: string;
      version: number;
      updatedAt: string;
    },
    mes: Message
  ): Promise<void> {
    try {
      const ticket = await ticketModel.findOne({
        _id: data.id,
        version: data.version - 1,
      });
      if (!ticket) {
        throw new Error("Ticket not found");
      }
      ticket.set({
        title: data.title,
        price: data.price,
        updatedAt: data.updatedAt,
        orderId: data.orderId,
      });
      await ticket.save({ timestamps: false }); // not set updatedAt automately
      console.log(ticket);
      mes.ack();
    } catch (error) {
      console.log(error);
    }
  }
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
  queueGroup = QueueName.OrderService;
}
