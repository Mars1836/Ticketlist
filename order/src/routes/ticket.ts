import express, { NextFunction, Request, Response } from "express";

import { body, validationResult } from "express-validator";
import { DatabaseConnectionError, validate_request } from "@cl-ticket/common";
import { RequestValidationError } from "@cl-ticket/common";

import { handleAsync } from "@cl-ticket/common";
import { requireAuth } from "@cl-ticket/common";
import { orderCtrl } from "../controllers/order";
import { ticketCtrl } from "../controllers/ticket";
const ticketRouter = express.Router();
ticketRouter.get("/", (req, res) => {
  res.json("asdasd");
});

ticketRouter.post(
  "/",
  handleAsync(validate_request),
  handleAsync(requireAuth),
  handleAsync(ticketCtrl.create)
);

export default ticketRouter;
