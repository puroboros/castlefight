import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';


export type Player = {
    id: string,
    race: string,
    status: string,
    gold: number,
    wood: number,
    activeTroops: number,
    activeBuilding: number

}
export type Troop = {
    position: {
        first: number,
        second: number
    },
    id: number,
    currentHp: number,
    currentHpRegen: number,
    currentMana: number,
    currentManaRegen: number,
    maxHp: number,
    maxMp: number,
    speed: number,
    attack: number
}
export type Match = {
    players: Player[],
    owner: string,
    maxPlayers: number,
    status: string,
    id: number,
    troops: Troop[]
}

export type GameSelection = {
    method: string,
    content: Match[] | string |Match
}

export class SocketConnector {
    stompClient: Stomp.Client = {} as any;
    socket: WebSocket = {} as any;
    username: string;
    connected: Subject<boolean> = new Subject<boolean>();
    private internalGameSelection: Subject<GameSelection> = new Subject<GameSelection>();
    get gameSelection(): Observable<GameSelection> {
        return this.internalGameSelection.asObservable();
    }
    constructor() {
        this.username = '';
        

    }

    private internalGameEvent: Subject<object> = new Subject<object>();
    get gameEvent(): Observable<object> {
        return this.internalGameEvent.asObservable();
    }
    connect() {
        const url = window.location.hostname;
        this.socket = new SockJS('http://' + url + ':1080/websocket');
        this.stompClient = Stomp.over(this.socket);
        if (this.stompClient) {
            // this.stompClient.disconnect(() => { });
        }

        // this.stompClient.debug = null;
        this.stompClient.connect({}, (frame) => {
            if (frame) {
                console.log('Connected: ' + frame.toString());
                this.username = frame.toString().split('\n')[1].split(':')[1];
                this.connected.next(true);
                this.stompClient.subscribe('/user/menu/game-selection', (greeting) => {

                    console.log('received from game-selection ', JSON.parse(greeting.body));
                    console.log(JSON.parse(greeting.body).method);
                    this.internalGameSelection.next(JSON.parse(greeting.body));
                    if (JSON.parse(greeting.body).method === 'error') {
                        this.displayToasterError('Error:', JSON.parse(greeting.body).content);
                    }
                });

                this.stompClient.subscribe('/user/menu/game-command', (greeting) => {

                    console.log('received from game-command', JSON.parse(greeting.body));
                    console.log(JSON.parse(greeting.body).method);
                    this.internalGameEvent.next(JSON.parse(greeting.body));
                    if (JSON.parse(greeting.body).method === 'error') {
                        this.displayToasterError('Error:', JSON.parse(greeting.body).content);
                    }
                });
            }
        }, error => {
            this.displayToasterError('Connection Error:', error);
        });
    }

    send(info: any) {
        console.log('send: ', info);
        if (this.stompClient.connected) {
            this.stompClient.send('/game/game-selection', {}, JSON.stringify(info));
        } else {
            this.connected.subscribe(connected => {
                this.stompClient.send('/game/game-selection', {}, JSON.stringify(info));
            });
        }
    }

    sendToGame(info: any) {
        console.log('sendToGame: ', info);
        if (this.stompClient.connected) {
            this.stompClient.send('/game/game-command', {}, JSON.stringify(info));
        } else {
            this.connected.subscribe(connected => {
                this.stompClient.send('/game/game-command', {}, JSON.stringify(info));
            });
        }
    }

    displayToasterError(title: string, error: any) {
        const closeButton = `<div onclick="document.getElementById('toaster').style.visibility = 'hidden'">X</div>`;
        const toaster = document.getElementById('toaster');
        if (toaster) {
            toaster.innerHTML = title + ' ' + error + closeButton;
            toaster.style.visibility = 'visible';
        }
    }
}