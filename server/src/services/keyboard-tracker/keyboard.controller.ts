import { Request, Response } from "express";
import { keyboardService } from "./keyboard.service";

export class KeyboardController {
	getAllStats(req: Request, res: Response) {
		try {
			const stats = keyboardService.getAll();
			res.json(stats);
		} catch (err) {
			res.status(500).json({ error: "Ошибка при получении статистики" });
		}
	}
	getAnalytics(req: Request, res: Response) {
		try {
			const analytics = keyboardService.getAnalytics();
			res.json(analytics);
		} catch (err) {
			res.status(500).json({ error: "Ошибка при получении аналитики" });
		}
	}
}

export const keyboardController = new KeyboardController();
