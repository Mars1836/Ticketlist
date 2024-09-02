import Stripe from "stripe";
import { constEnv } from "../configs/env";
console.log(constEnv.stripeSecretKey!);
export const stripe = new Stripe(constEnv.stripeSecretKey!, {
  apiVersion: "2024-06-20",
});
