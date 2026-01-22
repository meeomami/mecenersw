import express from "express";
import { keyboardRouter } from "./services/keyboard-tracker/keyboard.routes";
import { startKeyboardListener } from "./services/keyboard-tracker/keyboard.listener";

export function createApp() {
	const app = express();

	app.use(express.json());
	app.use("/api/keyboard", keyboardRouter);

	startKeyboardListener(app);

	return app;
}
