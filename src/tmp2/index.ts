import { over } from "stompjs";
import { Client } from "stompjs";
import * as  SockJS from "sockjs-client";

let stompClient: Client = null;

function connect() {
	const socket = new SockJS('http://localhost:666/websocket');

	stompClient = over(socket);
	const headers = {
		login: 'user',
		passcode: 'password'
	};
	stompClient.connect(headers, function (frame) {
		console.log('Connected: ' + frame);
		stompClient.subscribe('/game/game-selection',  (greeting) => {
			console.log(JSON.stringify(greeting));
		});
	});
}

function disconnect() {
	if (stompClient !== null) {
		stompClient.disconnect(() => {});
	}
	console.log("Disconnected");
}

function sendName() {
	stompClient.send("/app/user", {}, JSON.stringify({ 'name': ("#name") }));
}
