import request from "supertest";
import app from "../../app";
it("should return 200 status code when authrized", async () => {
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
  const cookie = res.get("Set-Cookie");
  const res2 = await request(app)
    .get("/api/users/current-user")
    .set("Cookie", cookie!);
  expect(res2.body.user.email).toEqual("hau123@gmail.com");
});
