import request from "supertest";
import app from "../../app";
it("should return 201 status code", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "hau@gmail.com",
      password: "11231",
    })
    .expect(201);
});
it("should return 400 status code when email invalid", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "haugmail.com",
      password: "11231",
    })
    .expect(400);
});
it("should return 400 status code when password invalid", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "hau@gmail.com",
      password: "1",
    })
    .expect(400);
});
it("should return 400 status code when email or password is missing", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "hau@gmail.com",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "asdadsa",
    })
    .expect(400);
});
it("should return 400 status code when email is signed twice", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "hau@gmail.com",
      password: "123123",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "hau@gmail.com",
      password: "1231223",
    })
    .expect(400);
});
it("should return 400 status code when email is signed twice", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "hau@gmail.com",
      password: "123123",
    })
    .expect(201);
  expect(res.get("Set-Cookie")).toBeDefined();
});
