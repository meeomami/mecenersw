export interface KeyEvent {
	time: Date;
}

export interface AppStats {
	appName: string;
	content: Record<string, KeyEvent[]>;
}

export interface KeyboardDB {
	[year: string]: {
		[month: string]: {
			[day: string]: AppStats[];
		};
	};
}

export interface KeyboardAnalytics {
	totalKeys: number;
	topKeys: { key: string; count: number }[];
	topApps: { appName: string; count: number }[];
	heatmapDay: Record<string, number>;
	heatmapHour: Record<string, number>;
	heatmapMinute: Record<string, number>;
	keyDistribution: Record<string, number>;
}
