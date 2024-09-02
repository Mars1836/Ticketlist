import { BadRequestError } from "@cl-ticket/common";
import { UserAttr, userModel } from "../models/user.model";
import bcrypt from "bcrypt";
import * as _ from "lodash";
import jwt from "jsonwebtoken";
import { constEnv } from "../configs/env";
async function create(userAttr: UserAttr) {
  const checkEmail = await userModel.findOne({ email: userAttr.email });

  if (checkEmail) {
    throw new BadRequestError("Email in use");
  }
  userAttr.password = await bcrypt.hash(
    userAttr.password,
    parseInt(constEnv.passwordSalt!)
  );
  // Store hash in your password DB.
  const user = await userModel.create(userAttr);
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
    },
    constEnv.jwtSecret!
  );

  return { user, token };
}
async function login(userAttr: UserAttr) {
  const user = await userModel.findOne({
    email: userAttr.email,
  });
  if (!user) {
    throw new BadRequestError("Email or password is wrong");
  }
  const verify = await bcrypt.compare(
    userAttr.password,
    user.password as string
  );

  if (!verify) {
    throw new BadRequestError("Email or password is wrong");
  }
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
    },
    constEnv.jwtSecret!
  );

  return { user, token };
}
const getCurrentUser = (jwtToken: string) => {
  const payload = jwt.verify(jwtToken, constEnv.jwtSecret!);
  if (payload) {
    return payload;
  } else {
    return null;
  }
};
export const userService = {
  create,
  login,
  getCurrentUser,
};
