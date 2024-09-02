import { PaymentCreatedEvent, Publisher } from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subject.PaymentCreated = Subject.PaymentCreated;
}
