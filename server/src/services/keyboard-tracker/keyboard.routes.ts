import { Router } from "express";
import { getAllStats } from "./keyboard.controller";

export const keyboardRouter = Router();

keyboardRouter.get("/stats", getAllStats);
