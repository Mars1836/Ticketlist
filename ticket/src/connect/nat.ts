import { randomUUID } from "crypto";
import { Stan } from "node-nats-streaming";
import sc from "node-nats-streaming";
import { OrderCreatedListener } from "../events/listener/order_create_listener";
import { OrderCancelledListener } from "../events/listener/order_cancelled_listener";
import { constEnv } from "../configs/env";

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
      constEnv.natClient || "ticket_" + randomUUID(),
      constEnv.natUrl!
    );
    new OrderCreatedListener(nat.client).listen();
    new OrderCancelledListener(nat.client).listen();
    nat.client.on("close", () => {
      console.log("Nats connections closed!");
      process.exit();
    });
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
