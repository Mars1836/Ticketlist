import "dotenv/config";
import { connectNat } from "./connect/nat";
import { expireQueue } from "./queue";

connectNat();
