export function getDateParts() {
	const now = new Date();

	return {
		year: String(now.getFullYear()),
		month: String(now.getMonth() + 1).padStart(2, "0"),
		day: String(now.getDate()).padStart(2, "0"),
	};
}
