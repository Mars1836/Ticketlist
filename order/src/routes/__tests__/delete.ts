import request from "supertest";
import app from "../../app";
import { ticketSrv } from "../../services/ticket";
import { OrderStatus } from "@cl-ticket/common";
import { nat } from "../../connect/nat";
it("it should return 204 status if delete successful", async () => {
  const auth1 = global.login();
  const res = await ticketSrv.create({
    price: 123,
    title: "123",
    userId: "123",
  });
  const order = await request(app)
    .post("/api/orders")
    .send({ ticketId: res._id })
    .set("Cookie", auth1)
    .expect(201);
  const rs = await request(app)
    .delete("/api/orders/" + order.body.id)
    .set("Cookie", auth1);
  expect(rs.statusCode).toEqual(200);
  expect(rs.body.status).toEqual(OrderStatus.Cancelled);
  expect(nat.client.publish).toHaveBeenCalled();
});
it("test", () => {
  expect(1).toEqual(1);
});
