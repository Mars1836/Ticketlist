import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { userCtl } from "../controllers/user.controller";
import { handleAsync } from "@cl-ticket/common";
import { requireAuth } from "@cl-ticket/common";

const router = express.Router();
router.get("/test", (req: Request, res: Response) => {
  res.status(200).json("Test success!");
});
router.get("/infor", (req: Request, res: Response) => {
  res.status(200).json("Current users");
});
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 50 })
      .withMessage("Password must be between 4 and 50 characters"),
  ],
  handleAsync(userCtl.login)
);
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 50 })
      .withMessage("Password must be between 4 and 50 characters"),
  ],
  handleAsync(userCtl.create)
);
router.get(
  "/current-user",
  handleAsync(requireAuth),
  handleAsync(userCtl.getCurrentUser)
);
router.post("/logout", handleAsync(userCtl.logout));

export default router;
