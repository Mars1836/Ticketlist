import { ConstEnv, RunModes } from "@cl-ticket/common";
const instance = new ConstEnv(process.env.RUN_MODE as RunModes);
instance.setKey("jwtSecret");
instance.setKey("mongoUrl");
// instance.setKey("natClient");
instance.setKey("natUrl");
instance.setKey("passwordSalt");
instance.setKey("runMode");
instance.setKey("jwtSecret");
export const constEnv = instance.const;
