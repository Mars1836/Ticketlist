import request from "supertest";
import app from "../../app";
import { title } from "process";
import mongoose from "mongoose";
import { nat } from "../../connect/nat";
import { ticketModel } from "../../models/ticket.model";
const createTicket = async (auth?: string[]) => {
  const res = await request(app)
    .post("/api/tickets")
    .send({ title: "sadfdasf", price: 20 })
    .set("Cookie", auth || global.login())
    .expect(201);
  return res;
};
it("should return status 401 if id not valid", async () => {
  const tk = await createTicket();
  await request(app)
    .patch(`/api/tickets/${tk.body.id}`)
    .send({ title: "namemsmm", price: 21 })
    .expect(401);
});
it("it should return status 400 if do not find ticket", async () => {
  const newObjectId = new mongoose.Types.ObjectId().toString();

  const res = await request(app)
    .patch(`/api/tickets/${newObjectId}`)
    .set("Cookie", global.login())
    .send({
      title: "asdsa",
    });
  expect(res.statusCode).toEqual(400);
});
it("should return status 200 when update ticket success", async () => {
  const auth = global.login();
  const t1 = await createTicket(auth);
  const t2 = await createTicket(auth);
  const res = await request(app)
    .patch(`/api/tickets/${t1.body.id}`)
    .set("Cookie", auth)
    .send({ title: "ticke_update", price: 21 });

  expect(res.statusCode).toEqual(200);
  expect(res.body.title).toEqual("ticke_update");
  expect(res.body.price).toEqual(21);
  const res2 = await request(app)
    .patch(`/api/tickets/${t2.body.id}`)
    .set("Cookie", auth)
    .send({ title: "ticke_update2", price: 12 });
  expect(res2.statusCode).toEqual(200);
  expect(res2.body.title).toEqual("ticke_update2");
});
it("it should return status 400 if price or title not valid", async () => {
  const t1 = await createTicket();
  await createTicket();
  await request(app)
    .patch(`/api/tickets/${t1.body.id}`)
    .set("Cookie", global.login())
    .send({ title: "ticke_update", price: -21 })
    .expect(400);
  await request(app)
    .patch(`/api/tickets/${t1.body.id}`)
    .set("Cookie", global.login())
    .send({ title: "" })
    .expect(400);
});
it("It should publish updated event", async () => {
  const auth = global.login();
  const t1 = await createTicket(auth);
  const res = await request(app)
    .patch(`/api/tickets/${t1.body.id}`)
    .set("Cookie", auth)
    .send({ title: "ticke_update", price: 21 });
  expect(res.statusCode).toEqual(200);
  expect(res.body.title).toEqual("ticke_update");
  expect(res.body.price).toEqual(21);
  expect(nat.client.publish).toHaveBeenCalledTimes(2);
});
it("It should reject updating resevered ticket", async () => {
  const auth = global.login();
  const t1 = await createTicket(auth);
  const ticket = await ticketModel.findById(t1.body.id);
  ticket!.set({
    orderId: new mongoose.Types.ObjectId(),
  });
  await ticket!.save();
  const res = await request(app)
    .patch(`/api/tickets/${t1.body.id}`)
    .set("Cookie", auth)
    .send({ title: "ticke_update", price: 21 });
  expect(res.statusCode).toEqual(400);
});
