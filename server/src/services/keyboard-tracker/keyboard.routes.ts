import { Router } from "express";
import { keyboardController } from "./keyboard.controller";

export const keyboardRouter = Router();

keyboardRouter.get("/stats", (req, res) => keyboardController.getAllStats(req, res));
keyboardRouter.get("/analytics", (req, res) => keyboardController.getAnalytics(req, res));
