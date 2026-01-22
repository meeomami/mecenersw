import { GlobalKeyboardListener } from "node-global-key-listener";
import activeWin from "active-win";
import { keyboardDB } from "./keyboard.storage";
import { getDateParts } from "../../shared/utils/dates";
import { Express } from "express";
import { KeyboardDB } from "./keyboard.types";

const listener = new GlobalKeyboardListener();

const inMemoryDB: KeyboardDB = {};

let saveTimeout: NodeJS.Timeout | null = null;

export function startKeyboardListener(app: Express) {
	const io = app.get("io");

	listener.addListener((e) => {
		if (e.state !== "UP") return;

		(async () => {
			const win = await activeWin();
			const appName = (win?.owner?.name === "Проводник" ? "Explorer" : win?.owner?.name) || "Explorer";
			const key = e.name || "unknown";

			updateInMemoryDB(appName, key);

			io?.emit("keyboard-update", { appName, key, data: inMemoryDB });

			scheduleSave();
		})();
	});

	console.log("Keyboard listener started");
}

function updateInMemoryDB(appName: string, key: string) {
	const { year, month, day } = getDateParts();

	inMemoryDB[year] ??= {};
	inMemoryDB[year][month] ??= {};
	inMemoryDB[year][month][day] ??= [];

	const dayStats = inMemoryDB[year][month][day];
	let appStats = dayStats.find((a) => a.appName === appName);

	if (!appStats) {
		appStats = { appName, content: {} };
		dayStats.push(appStats);
	}

	appStats.content[key] = (appStats.content[key] || 0) + 1;
}

function scheduleSave() {
	if (saveTimeout) return;

	saveTimeout = setTimeout(() => {
		const diskData = keyboardDB.read();

		mergeDB(diskData, inMemoryDB);

		keyboardDB.write(diskData);

		for (const y in inMemoryDB) delete inMemoryDB[y];

		saveTimeout = null;
	}, 5000);
}

function mergeDB(disk: KeyboardDB, memory: KeyboardDB) {
	for (const year in memory) {
		disk[year] ??= {};
		for (const month in memory[year]) {
			disk[year][month] ??= {};
			for (const day in memory[year][month]) {
				disk[year][month][day] ??= [];

				const memDayStats = memory[year][month][day];
				const diskDayStats = disk[year][month][day];

				memDayStats.forEach((memApp) => {
					const diskApp = diskDayStats.find((a) => a.appName === memApp.appName);
					if (!diskApp) {
						diskDayStats.push({ ...memApp, content: { ...memApp.content } });
					} else {
						for (const key in memApp.content) {
							diskApp.content[key] = (diskApp.content[key] || 0) + memApp.content[key];
						}
					}
				});
			}
		}
	}
}
