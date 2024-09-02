import { randomUUID } from "crypto";
import { Stan } from "node-nats-streaming";
import sc from "node-nats-streaming";
import { TicketCreatedListener } from "../events/listener/ticket_created_listener";
import { TicketUpdatedListener } from "../events/listener/ticket_updated_listener";
import { constEnv } from "../configs/env";
import { ExpirationOrderHandledListener } from "../events/listener/expiration_order_handled_listener";
import { PaymentCreatedListener } from "../events/listener/payment_order_handled_listener";

class Nat {
  private _client?: Stan;
  get client() {
    if (!this._client) {
      throw new Error("Nat stream was not connected");
    }
    return this._client;
  }
  connect(clusterId: string, clientId: string, url: string) {
    this._client = sc.connect(clusterId, clientId, {
      url,
    });
    return new Promise((res, rej) => {
      this.client.on("connect", () => {
        console.log("Nat streaming is connected successful");
        res(1);
      });
      this.client.on("error", (err) => {
        rej(err);
      });
    });
  }
}
export const nat = new Nat();
export async function connectNat() {
  try {
    await nat.connect(
      "ticketing",
      constEnv.natClient || "order_" + randomUUID(),
      constEnv.natUrl!
    );
    nat.client.on("close", () => {
      console.log("Nats connections closed!");
      process.exit();
    });
    new TicketCreatedListener(nat.client).listen();
    new TicketUpdatedListener(nat.client).listen();
    new ExpirationOrderHandledListener(nat.client).listen();
    new PaymentCreatedListener(nat.client).listen();
    process.on("SIGINT", () => {
      nat.client.close();
    });
    process.on("SiGTERM", () => {
      nat.client.close();
    });
  } catch (error) {
    console.log(error);
  }
}
