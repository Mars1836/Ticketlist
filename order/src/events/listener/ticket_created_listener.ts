import { Listener, TicketCreatedEvent } from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
import { Message } from "node-nats-streaming";
import { ticketSrv } from "../../services/ticket";
import { QueueName } from "./queue_name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroup = QueueName.OrderService;
  async onMessage(
    data: {
      title: string;
      price: number;
      userId: string;
      id: string;
      createdAt: string;
      updatedAt: string;
      version: number;
    },
    mes: Message
  ): Promise<void> {
    try {
      const ticket = await ticketSrv.create({
        ...data,
      });
      // console.log(ticket);
      mes.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
