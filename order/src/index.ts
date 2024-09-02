import "dotenv/config";

// import "express-async-errors";
import { connectMongo } from "./connect/mongo";
import app from "./app";
import { connectNat } from "./connect/nat";
import { randomUUID } from "crypto";
import { constEnv } from "./configs/env";

connectMongo();
connectNat();

app.listen(4002, () => {
  console.log(process.env.NATS_CLIENT_ID);
  console.log(constEnv);

  console.log("Listening on 4002 :: Orders service");
});
