// TODO: Chat app with server as relay, server won't be able to decrypt messages sent between clients
// but will maintain a secure connection to each client

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");

const ecl = require("ecurvelite");
const curve = ecl.CURVES.brainpoolP160r1;
const serverKeys = new ecl.KeyPair(curve);

var userKeys = {};

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/chat_client.html");
});

app.get("/ecurvelite.min.js", (req, res) => {
	res.sendFile(path.resolve(__dirname + "../../../client/ecurvelite.min.js"));
});

io.on("connection", (socket) => {
	console.log("Connection");
	socket.on("public_key", (publicKey) => {
		userKeys[socket.id] = ecl.createKey(serverKeys.calculateSharedSecret(ecl.decodePoint(publicKey)), ecl.KEY_SIZE_128);
		socket.emit("public_key", ecl.encodePoint(serverKeys.publicKey));
	});
	socket.on("chat_message", (encryptedMsg) => {
		const msg = ecl.decrypt(encryptedMsg, userKeys[socket.id]);
		console.log(msg);
	});
	socket.on("disconnect", () => {
		delete userKeys[socket.id];
		console.log("User disconnected.");
	});
});

server.listen(3000, () => {
	console.log("Listening on *:3000");
});