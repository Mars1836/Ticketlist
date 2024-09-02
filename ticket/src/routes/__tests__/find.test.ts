import request from "supertest";
import app from "../../app";
import { title } from "process";
import mongoose from "mongoose";
const createTicket = async () => {
  const res = await request(app)
    .post("/api/tickets")
    .send({ title: "sadfdasf", price: 20 })
    .set("Cookie", global.login())
    .expect(201);
  return res;
};
it("should return status 400 if id not valid", async () => {
  await request(app).get("/api/tickets/asddsad").expect(400);
});
it("it should return status 404 if id not found", async () => {
  const newObjectId = new mongoose.Types.ObjectId().toString();

  await request(app).get(`/api/tickets/${newObjectId}`).expect(404);
});
it("should return status 200 when get ticket success", async () => {
  const t1 = await createTicket();
  await createTicket();
  const res = await request(app).get(`/api/tickets/${t1.body.id}`);
  expect(res.statusCode).toEqual(200);
  expect(res.body.title).toEqual(t1.body.title);
});
// it("should return status 200 when get list ticket success", async () => {
//   await createTicket();
//   await createTicket();
//   await createTicket();
//   const res = await request(app).get(`/api/tickets`);

//   expect(res.body.length).toEqual(3);
// });
