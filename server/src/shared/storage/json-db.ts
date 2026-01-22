import fs from "fs";
import path from "path";

export class JsonDB<T> {
	constructor(private filePath: string) {}

	read(): T {
		if (!fs.existsSync(this.filePath)) {
			return {} as T;
		}

		return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
	}

	write(data: T) {
		fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
	}
}
