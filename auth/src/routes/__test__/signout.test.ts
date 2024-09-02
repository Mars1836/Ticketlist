import request from "supertest";
import app from "../../app";
it("should return 200 status code when sign out success", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "hau123@gmail.com",
      password: "123123",
    })
    .expect(201);
  await request(app)
    .post("/api/users/login")
    .send({
      email: "hau123@gmail.com",
      password: "123123",
    })
    .expect(200);
  const res = await request(app).post("/api/users/logout").expect(200);
  expect(res.get("Set-Cookie")![0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
