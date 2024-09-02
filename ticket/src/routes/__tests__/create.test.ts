import request from "supertest";
import app from "../../app";
import { nat } from "../../connect/nat";
import { ticketModel } from "../../models/ticket.model";
it("should return unauthourize error", async () => {
  await request(app).post("/api/tickets").expect(401);
});
it("should return authorize success", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.login());
  expect(res.status).not.toEqual(401);
});
it("should return 400 if title is not provided", async () => {
  await request(app)
    .post("/api/tickets")
    .send({ title: "", price: 12 })
    .set("Cookie", global.login())
    .expect(400);
});
it("should return 400 if price is not valid", async () => {
  await request(app)
    .post("/api/tickets")
    .send({ title: "asd", price: -12 })
    .set("Cookie", global.login())
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .send({ title: "asd" })
    .set("Cookie", global.login())
    .expect(400);
});
it("should return 200 request is valid", async () => {
  await request(app)
    .post("/api/tickets")
    .send({ title: "ssds", price: 12 })
    .set("Cookie", global.login())
    .expect(201);
});
it("publish an event", async () => {
  await request(app)
    .post("/api/tickets")
    .send({ title: "ssds", price: 12 })
    .set("Cookie", global.login())
    .expect(201);
  expect(nat.client.publish).toHaveBeenCalled();
});
