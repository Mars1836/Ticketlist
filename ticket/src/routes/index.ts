import express, { NextFunction, Request, Response } from "express";

import { body, validationResult } from "express-validator";
import { DatabaseConnectionError, validate_request } from "@cl-ticket/common";
import { RequestValidationError } from "@cl-ticket/common";

import { handleAsync } from "@cl-ticket/common";
import { verifyUser } from "@cl-ticket/common";
import { requireAuth } from "@cl-ticket/common";
import { ticketCtrl } from "../controllers/ticket";
const router = express.Router();
router.get("/test", (req: Request, res: Response) => {
  res.status(200).json("Test success!");
});
router.get("/", handleAsync(ticketCtrl.getAll));
router.get("/:id", handleAsync(ticketCtrl.getById));
router.post(
  "/",
  handleAsync(requireAuth),
  [
    body("title").notEmpty().withMessage("Title must be provided!"),
    body("price").isFloat({ gt: 0 }).withMessage("Price is not valid"),
  ],
  handleAsync(validate_request),
  handleAsync(ticketCtrl.create)
);
router.patch(
  "/:id",
  handleAsync(requireAuth),
  [
    body("title")
      .optional()
      .isString()
      .withMessage("Title must be a string")
      .notEmpty()
      .withMessage("Title cannot be an empty string"),

    body("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Price must be a number larger than 0"),
  ],
  handleAsync(validate_request),
  handleAsync(ticketCtrl.update)
);
export default router;
