import { keyboardDB } from "./keyboard.storage";

class KeyboardService {
	getAll() {
		return keyboardDB.read();
	}
}

export const keyboardService = new KeyboardService();
