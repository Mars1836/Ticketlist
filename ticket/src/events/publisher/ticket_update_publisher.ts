import { Publisher, TicketUpdatedEvent } from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
export class TicketUpdatedPublish extends Publisher<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
}
