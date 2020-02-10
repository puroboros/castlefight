import * as Stomp from 'stompjs';
import * as  SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

export class SocketConnector {
    stompClient: Stomp.Client;
    socket: WebSocket;
    username: string;
    connected: Subject<boolean> = new Subject<boolean>();
    private internalGameSelection: Subject<object> = new Subject<object>();
    get gameSelection() {
        return this.internalGameSelection.asObservable();
    }
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
            this.stompClient.subscribe('/user/menu/game-selection', (greeting) => {
                console.log('PEPINO ' + JSON.stringify(JSON.parse(greeting.body)));
                console.log(JSON.parse(greeting.body).method);
                this.internalGameSelection.next(JSON.parse(greeting.body));
            });
        });
    }

    send(info: any) {
        if (this.stompClient.connected) {
            this.stompClient.send('/game/game-selection', {}, JSON.stringify(info));
        } else {
            this.connected.subscribe(connected => {
                this.stompClient.send('/game/game-selection', {}, JSON.stringify(info));
            });
        }
    }


}