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
        const url = window.location.hostname;
        this.socket = new SockJS('http://' + url + ':80/websocket');
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
                if(JSON.parse(greeting.body) .method === 'error'){
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

    displayToasterError(title, error) {
        document.getElementById('toaster').innerHTML=title + ' ' + error;
        document.getElementById('toaster').style.visibility = 'visible';
    }
}