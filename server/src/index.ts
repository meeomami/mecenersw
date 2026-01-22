import chalk from "chalk";
import { createApp } from "./app";
import http from "http";
import { Server } from "socket.io";

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
	cors: { origin: "*" },
});

app.set("io", io);

const PORT = 8833;

server.listen(PORT, () => {
	console.log(chalk.cyan(`Server started on http://localhost:${PORT}`));
});
