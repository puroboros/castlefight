import './style.css';
import './connection';
import { SocketConnector } from './connection';
import { MenuLayout } from './main-menu/init';
import { Match } from './match/match';
import { View } from './view/view';
require('./assets/q.jpg');
require('./assets/w.png');
const socketConnector = new SocketConnector();

window.onload = () => {
	const menuLayout = new MenuLayout(socketConnector);
	const view = new View();
	const match = new Match(socketConnector.gameEvent, view);
}

