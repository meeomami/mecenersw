import path from "path";
import { KeyboardDB } from "./keyboard.types";
import { JsonDB } from "../../shared/storage/json-db";

const filePath = path.resolve(__dirname, "../../data/keyboard.json");

export const keyboardDB = new JsonDB<KeyboardDB>(filePath);
