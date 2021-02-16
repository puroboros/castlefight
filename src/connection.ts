import * as Stomp from 'stompjs';
import * as  SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';

export class SocketConnector {
    stompClient: Stomp.Client;
    socket: WebSocket;
    username: string;
    connected: Subject<boolean> = new Subject<boolean>();
    private internalGameSelection: Subject<object> = new Subject<object>();
    get gameSelection(): Observable<object> {
        return this.internalGameSelection.asObservable();
    }
    constructor() {
        this.connect();
    }

    private internalGameEvent: Subject<object> = new Subject<object>();
    get gameEvent(): Observable<object> {
        return this.internalGameEvent.asObservable();
    }
    connect() {
        if (this.stompClient) {
            this.stompClient.disconnect(() => { });
        }
        const url = window.location.hostname;
        this.socket = new SockJS('http://' + url + ':1080/websocket');
        this.stompClient = Stomp.over(this.socket);
        this.stompClient.debug = null;
        this.stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame.toString());
            this.username = frame.toString().split('\n')[1].split(':')[1];
            this.connected.next(true);
            this.stompClient.subscribe('/user/menu/game-selection', (greeting) => {

                console.log('PEPINO ' + JSON.stringify(JSON.parse(greeting.body)));
                console.log(JSON.parse(greeting.body).method);
                this.internalGameSelection.next(JSON.parse(greeting.body));
                if (JSON.parse(greeting.body).method === 'error') {
                    this.displayToasterError('Error:', JSON.parse(greeting.body).content);
                }
            });

            this.stompClient.subscribe('/user/game', (greeting) => {

                console.log('PEPINO 2' + JSON.stringify(JSON.parse(greeting.body)));
                console.log(JSON.parse(greeting.body).method);
                this.internalGameEvent.next(JSON.parse(greeting.body));
                if (JSON.parse(greeting.body).method === 'error') {
                    this.displayToasterError('Error:', JSON.parse(greeting.body).content);
                }
            });
        }, error => {
            this.displayToasterError('Connection Error:', error);
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

    sendToGame(info: any) {
        if (this.stompClient.connected) {
            this.stompClient.send('/game/game', {}, JSON.stringify(info));
        } else {
            this.connected.subscribe(connected => {
                this.stompClient.send('/game/game', {}, JSON.stringify(info));
            });
        }
    }

    displayToasterError(title, error) {
        const closeButton = `<div onclick="document.getElementById('toaster').style.visibility = 'hidden'">X</div>`;
        document.getElementById('toaster').innerHTML = title + ' ' + error + closeButton;
        document.getElementById('toaster').style.visibility = 'visible';
    }
}