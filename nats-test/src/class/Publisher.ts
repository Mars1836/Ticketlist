import { Stan } from "node-nats-streaming";
import { Event } from "../events";
import { Subject } from "../subject";

export abstract class Publiser<T extends Event> {
  protected stan;
  abstract subject: T["subject"];
  publish(data: T["data"]) {
    this.stan.publish(this.subject, JSON.stringify(data), () => {
      console.log("Event publish");
    });
  }
  constructor(stan: Stan) {
    this.stan = stan;
  }
}
