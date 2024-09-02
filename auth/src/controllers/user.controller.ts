import { validationResult } from "express-validator";
import { userService } from "../services/user";
import { RequestValidationError } from "@cl-ticket/common";
import { UserAttr } from "../models/user.model";
import { Request, Response } from "express";
import { BadRequestError } from "@cl-ticket/common";
import jwt from "jsonwebtoken";
async function create(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  const userAttr: UserAttr = req.body;

  const { user, token } = await userService.create(userAttr);
  req.session = {
    jwt: token,
  };
  res.status(201).json(user);
}
async function login(req: Request, res: Response) {
  console.log("..............");
  console.log(req.headers);
  console.log("__________");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  const userAttr: UserAttr = req.body;
  const { user, token } = await userService.login(userAttr);
  req.session = {
    jwt: token,
  };
  res.status(200).json(user);
}
async function getCurrentUser(req: Request, res: Response) {
  res.status(200).json({ user: req.user || null });
}
async function logout(req: Request, res: Response) {
  req.session = null;
  res.status(200).json({});
}
export const userCtl = {
  create,
  login,
  getCurrentUser,
  logout,
};
