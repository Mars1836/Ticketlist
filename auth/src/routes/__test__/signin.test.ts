import request from "supertest";
import app from "../../app";
it("should return 400 status code if missing email or password", async () => {
  await request(app)
    .post("/api/users/login")
    .send({
      email: "hau@gmail.com",
    })
    .expect(400);
  await request(app)
    .post("/api/users/login")
    .send({
      password: "123123",
    })
    .expect(400);
});
it("should return 400 status code when email or password wrong", async () => {
  return request(app)
    .post("/api/users/login")
    .send({
      email: "hau@gmail.com",
      password: "11231",
    })
    .expect(400);
});
it("should return 200 status code when email and password is correct", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "hau123@gmail.com",
      password: "123123",
    })
    .expect(201);
  const res = await request(app)
    .post("/api/users/login")
    .send({
      email: "hau123@gmail.com",
      password: "123123",
    })
    .expect(200);
  expect(res.get("Set-Cookie")).toBeDefined();
});
