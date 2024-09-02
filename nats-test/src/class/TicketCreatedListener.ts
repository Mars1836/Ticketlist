import { Message } from "node-nats-streaming";
import { Listener } from "./Listener";
import { TicketCreatedEvent } from "../events";
import { Subject } from "../subject";
interface Test {
  name: string;
}
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupe: string = "ticket-service";

  onMessage(data: TicketCreatedEvent["data"], mes: Message) {
    console.log(
      `Get message events ${mes.getSequence()} : title: ${
        data.title
      } / price:  ${data.price} / userId: ${data.userId}  `
    );
    mes.ack();
  }
}
