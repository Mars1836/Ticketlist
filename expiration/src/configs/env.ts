import { ConstEnv, RunModes } from "@cl-ticket/common";
const instance = new ConstEnv(process.env.RUN_MODE as RunModes);
instance.setKey("natUrl");
export const constEnv = instance.const;
