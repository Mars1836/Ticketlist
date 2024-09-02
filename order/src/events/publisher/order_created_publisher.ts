import { Publisher, OrderCreatedEvent } from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
export class OrderCreatedPublish extends Publisher<OrderCreatedEvent> {
  subject: Subject.OrderCreated = Subject.OrderCreated;
}
