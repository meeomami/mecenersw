import { Request, Response } from "express";
import { keyboardService } from "./keyboard.service";

export function getAllStats(req: Request, res: Response) {
	res.json(keyboardService.getAll());
}
