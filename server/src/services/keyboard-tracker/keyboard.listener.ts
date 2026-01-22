import { GlobalKeyboardListener } from "node-global-key-listener";
import activeWin from "active-win";
import { keyboardDB } from "./keyboard.storage";
import { getDateParts } from "../../shared/utils/dates";
import { Express } from "express";
import { KeyboardDB } from "./keyboard.types";

const listener = new GlobalKeyboardListener();
const inMemoryDB: KeyboardDB = keyboardDB.read();
let saveTimeout: NodeJS.Timeout | null = null;

export function startKeyboardListener(app: Express) {
	const io = app.get("io");

	listener.addListener((e) => {
		if (e.state !== "UP") return;

		(async () => {
			const win = await activeWin();
			const appName = (win?.owner?.name === "Проводник" ? "Explorer" : win?.owner?.name) || "Explorer";
			const key = e.name || "unknown";
			const now = new Date();

			updateInMemoryDB(appName, key, now);

			io?.emit("keyboard-realtime", { appName, key, time: now });

			scheduleSave();
		})();
	});

	console.log("Keyboard listener started");
}

function updateInMemoryDB(appName: string, key: string, time: Date) {
	const { year, month, day } = getDateParts(time);

	inMemoryDB[year] ??= {};
	inMemoryDB[year][month] ??= {};
	inMemoryDB[year][month][day] ??= [];

	const dayStats = inMemoryDB[year][month][day];
	let appStats = dayStats.find((a) => a.appName === appName);

	if (!appStats) {
		appStats = { appName, content: {} };
		dayStats.push(appStats);
	}

	if (!appStats.content[key]) appStats.content[key] = [];
	appStats.content[key].push({ time });
}

function scheduleSave() {
	if (saveTimeout) return;

	saveTimeout = setTimeout(() => {
		keyboardDB.write(inMemoryDB);
		saveTimeout = null;
	}, 5000);
}
