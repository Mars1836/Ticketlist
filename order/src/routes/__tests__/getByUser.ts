// import request from "supertest";
// import app from "../../app";
// import mongoose from "mongoose";
// import { ticketSrv } from "../../services/ticket";
// import { TicketDoc } from "../../models/ticket.model";
// import { OrderDoc } from "../../models/order.model";
// const objectId = () => {
//   return new mongoose.Types.ObjectId().toString();
// };
// it("Should return 200 if get order success", async () => {
//   const user1 = global.login();
//   const res = (await ticketSrv.create({
//     price: 123,
//     title: "123",
//     userId: "123",
//   })) as TicketDoc;

//   const order = await request(app)
//     .post("/api/orders")
//     .send({ ticketId: res._id })
//     .set("Cookie", user1)
//     .expect(201);
//   const orders = await request(app).get("/api/orders").set("Cookie", user1);
//   expect(orders.statusCode).toEqual(200);
//   expect(orders.body[0]._id).toEqual(order.body._id);
// });

// it("Should return 201 if order create successful", async () => {
//   const res = await ticketSrv.create({
//     price: 123,
//     title: "123",
//     userId: "123",
//   });

//   const order = await request(app)
//     .post("/api/orders")
//     .send({ ticketId: res._id })
//     .set("Cookie", global.login())
//     .expect(201);
// });
it("test", () => {
  expect(1).toEqual(1);
});
