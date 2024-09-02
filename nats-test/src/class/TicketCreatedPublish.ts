import { TicketCreatedEvent } from "../events";
import { Subject } from "../subject";
import { Publiser } from "./Publisher";

export class TicketCreatedPublish extends Publiser<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
