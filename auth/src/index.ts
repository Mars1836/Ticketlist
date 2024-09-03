import "dotenv/config";

// import "express-async-errors";
import { connectMongo } from "./db/mongo";

import app from "./app";
connectMongo();

app.listen(4000, () => {
  console.log("dev auth.......");
  console.log("Listening on 4000 :: Auth service");
});
