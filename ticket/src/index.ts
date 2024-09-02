import "dotenv/config";

// import "express-async-errors";
import { connectMongo } from "./connect/mongo";

import app from "./app";
import { connectNat } from "./connect/nat";
import { randomUUID } from "crypto";
import { constEnv } from "./configs/env";

connectMongo();
connectNat();

app.listen(4001, () => {
  console.log(process.env.NATS_CLIENT_ID);
  console.log(constEnv.natClient);

  console.log("Listening on 4001 :: Ticket service");
});
