export type KeyName = string;

export interface KeyStats {
	[key: string]: number;
}

export interface AppStats {
	appName: string;
	content: KeyStats;
}

export type DayStats = AppStats[];

export type MonthStats = {
	[day: string]: DayStats;
};

export type YearStats = {
	[month: string]: MonthStats;
};

export interface KeyboardDB {
	[year: string]: YearStats;
}
