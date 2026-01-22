import { keyboardDB } from "./keyboard.storage";
import { KeyboardAnalytics, KeyboardDB, KeyEvent } from "./keyboard.types";
import dayjs from "dayjs";

function createEmptyAnalytics(): KeyboardAnalytics {
	return {
		totalKeys: 0,
		topKeys: [],
		topApps: [],
		heatmapDay: {},
		heatmapMinute: {},
		heatmapHour: {},
		keyDistribution: {},
	};
}

export class KeyboardService {
	getAll() {
		return keyboardDB.read();
	}

	getAnalytics(): KeyboardAnalytics {
		const db = this.getAll();
		const analytics = createEmptyAnalytics();

		for (const year in db) {
			for (const month in db[year]) {
				for (const day in db[year][month]) {
					const dayStats = db[year][month][day];
					for (const app of dayStats) {
						const appKeyCount = Object.values(app.content).reduce((sum, events) => sum + events.length, 0);

						analytics.topApps.push({ appName: app.appName, count: appKeyCount });
						analytics.totalKeys += appKeyCount;

						for (const key in app.content) {
							const events: KeyEvent[] = app.content[key];

							analytics.keyDistribution[key] = (analytics.keyDistribution[key] || 0) + events.length;

							events.forEach(({ time }) => {
								const d = dayjs(time);
								const dayStr = d.format("YYYY-MM-DD");
								const hourStr = d.format("HH");
								const minuteStr = d.format("HH:mm");

								analytics.heatmapDay[dayStr] = (analytics.heatmapDay[dayStr] || 0) + 1;
								analytics.heatmapHour[hourStr] = (analytics.heatmapHour[hourStr] || 0) + 1;
								analytics.heatmapMinute[minuteStr] = (analytics.heatmapMinute[minuteStr] || 0) + 1;
							});
						}
					}
				}
			}
		}

		analytics.topKeys = Object.entries(analytics.keyDistribution)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10)
			.map(([key, count]) => ({ key, count }));

		analytics.topApps = analytics.topApps.sort((a, b) => b.count - a.count).slice(0, 10);

		return analytics;
	}
}

export const keyboardService = new KeyboardService();
