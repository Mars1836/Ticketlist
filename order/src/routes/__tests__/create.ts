import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { ticketSrv } from "../../services/ticket";
import { TicketDoc, ticketModel } from "../../models/ticket.model";
import { OrderDoc } from "../../models/order.model";
import { nat } from "../../connect/nat";
// jest.mock("nat");
const objectId = () => {
  return new mongoose.Types.ObjectId().toString();
};
it("Should return 404 if ticket not found", async () => {
  await request(app)
    .post("/api/orders")
    .send({ ticketId: objectId() })
    .set("Cookie", global.login())
    .expect(404);
});

it("Should return 400 if ticket id is not provided", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.login())
    .expect(400);
});
it("Should return 201 if order create successful", async () => {
  const res = await ticketSrv.create({
    price: 123312,
    title: "123312",
    userId: "123312",
  });
  expect(res).toBeDefined();

  const order = await request(app)
    .post("/api/orders")
    .send({ ticketId: res?._id })
    .set("Cookie", global.login())
    .expect(201);
  expect(nat.client.publish).toHaveBeenCalled();
});
// it.todo("publish event when order created");
it("test", () => {
  expect(1).toEqual(1);
});
