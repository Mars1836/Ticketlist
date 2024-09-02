import { Publisher, OrderCancelledEvent } from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
export class OrderCancelledPublish extends Publisher<OrderCancelledEvent> {
  subject: Subject.OrderCancelled = Subject.OrderCancelled;
}
