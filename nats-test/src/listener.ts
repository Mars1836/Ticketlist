import nat, { Message } from "node-nats-streaming";
import { TicketCreatedListener } from "./class/TicketCreatedListener";
console.clear();
const clientId = crypto.randomUUID().toString();
const stan = nat.connect("ticketing", clientId, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  const ticket_created = new TicketCreatedListener(stan).listen();
});
stan.on("error", (error) => {
  console.log("get error");
  console.log(error);
});
