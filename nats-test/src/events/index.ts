import { Subject } from "../subject";

export interface Event {
  subject: Subject;
  data: unknown;
}
export interface TicketCreatedEvent {
  subject: Subject.TicketCreated;
  data: {
    title: string;
    price: number;
    userId: string;
  };
}
