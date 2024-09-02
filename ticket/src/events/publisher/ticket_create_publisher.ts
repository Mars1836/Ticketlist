import { Publisher, TicketCreatedEvent } from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
export class TicketCreatedPublish extends Publisher<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
