import Queue from "bull";
import { ExpirationOrderHandledPublisher } from "../events/publisher/expiration_order_handled_publish";
import { nat } from "../connect/nat";
interface Payload {
  orderId: string;
}
export const expireQueue = new Queue<Payload>(
  "expire queue",
  "redis://127.0.0.1:6379"
);
expireQueue.process(3, async function (job, done) {
  new ExpirationOrderHandledPublisher(nat.client).publish({
    orderId: job.data.orderId,
  });
  done();
});
