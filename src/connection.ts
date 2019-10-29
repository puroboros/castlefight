import * as Stomp from 'stompjs';
import * as  SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

export class SocketConnector {
    stompClient: Stomp.Client;
    socket: WebSocket;
    connected: Subject<boolean> = new Subject<boolean>();
    constructor() {
        this.connect();
    }

    connect() {
        if (this.stompClient) {
            this.stompClient.disconnect(() => { });
        }

        this.socket = new SockJS('http://localhost:666/websocket');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.debug = null;
        this.stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            this.connected.next(true);
            this.stompClient.subscribe('/menu/game-selection', (greeting) => {
                console.log(JSON.stringify(JSON.parse(greeting.body)));
            });
            this.stompClient.subscribe('/user/menu/game-selection', (greeting) => {
                console.log('PEPINO ' + JSON.stringify(JSON.parse(greeting.body)));
            });
        });
    }

    send(info: string) {
        if (this.stompClient.connected) {
            this.stompClient.send('/game/game-selection', {}, info);
        } else {
            this.connected.subscribe( connected => {
                this.stompClient.send('/game/game-selection', {}, JSON.stringify({name: info}));
            });
        }
    }


}