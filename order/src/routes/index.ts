import express, { NextFunction, Request, Response } from "express";

import { body, validationResult } from "express-validator";
import { DatabaseConnectionError, validate_request } from "@cl-ticket/common";
import { RequestValidationError } from "@cl-ticket/common";

import { handleAsync } from "@cl-ticket/common";
import { requireAuth } from "@cl-ticket/common";
import { orderCtrl } from "../controllers/order";
const router = express.Router();
router.get("/", handleAsync(requireAuth), handleAsync(orderCtrl.getByUser));
router.get(
  "/:orderId",
  handleAsync(requireAuth),
  handleAsync(orderCtrl.getById)
);

router.post(
  "/",
  [body("ticketId").notEmpty().withMessage("Ticket id must be provided")],
  handleAsync(validate_request),
  handleAsync(requireAuth),
  handleAsync(orderCtrl.create)
);
router.delete(
  "/:orderId",
  handleAsync(requireAuth),
  handleAsync(orderCtrl.remove)
);
export default router;
