import { ExpirationOrderHandledEvent, Publisher } from "@cl-ticket/common";
import { Subject } from "@cl-ticket/common/build/events/subject";

export class ExpirationOrderHandledPublisher extends Publisher<ExpirationOrderHandledEvent> {
  subject: Subject.ExpirationOrderHandled = Subject.ExpirationOrderHandled;
}
