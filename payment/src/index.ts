import "dotenv/config";

// import "express-async-errors";
import { connectMongo } from "./connect/mongo";

import app from "./app";
import { connectNat } from "./connect/nat";
import { randomUUID } from "crypto";
import { constEnv } from "./configs/env";
import { connectRedis } from "./connect/redis";

connectMongo();
connectNat();
connectRedis();
app.listen(4003, () => {
  console.log(process.env.NATS_CLIENT_ID);
  console.log(constEnv.natClient);

  console.log("Listening on 4003 :: Payment service");
});
