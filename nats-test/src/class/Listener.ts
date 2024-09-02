import nat, { Message, Stan } from "node-nats-streaming";
import { Event } from "../events";

export abstract class Listener<T extends Event> {
  protected stan: Stan;
  abstract subject: T["subject"];
  abstract queueGroupe: string;
  abstract onMessage(data: T["data"], mes?: Message): void;
  protected ackWait = 5 * 1000;

  constructor(stan: Stan) {
    this.stan = stan;
  }
  listen() {
    const options = this.stan
      .subscriptionOptions()
      .setManualAckMode(true)
      .setDeliverAllAvailable()
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupe);
    console.log("Listen ", this.subject);
    console.log(this.queueGroupe);
    const lis = this.stan.subscribe(this.subject, this.queueGroupe, options);
    lis.on("message", (msg: Message) => {
      const data = this.parseData(msg.getData() as string);
      console.log(`Handle events ${msg.getSequence()} with data: ${data}`);
      this.onMessage(data, msg);
    });
    return this;
  }
  parseData(mes: string) {
    return typeof mes === "string"
      ? JSON.parse(mes)
      : JSON.parse(JSON.stringify(mes));
  }
}
