import { join } from "path";
import { Subject } from "rxjs";
import { Match, Player } from '../connection';
export class MenuLayout {
    public currentMatch: Match = {} as Match;
    public emitter: Subject<any> = new Subject<any>();
    public username: string = '';
    public currentScreen = 'joinCreate';
    public state: { matches: Match[], match: Match } = { matches: [], match: { players: [], owner: '', maxPlayers: 0, status: '', id: 0, troops: [] } };
    get menuEventEmitter() {
        return this.emitter.asObservable();
    }
    constructor() {
        this.populateMainMenu();
        console.log('olis');
    }


    populateMainMenu() {
        /*const mainMenu = document.getElementById('main-menu-content');
        if (mainMenu) {
            mainMenu.innerHTML =
                `<div id="create-match">Create Match</div>
            <div id="join-match">Join Match</div>`;
        }

        const createMatch = document.getElementById('create-match');
        if (createMatch) {
            createMatch.onclick = () => {
                console.log('creating match');
                this.emitter.next({ action: 'createMatch', details: '0' });
            };
        }
        const joinMatch = document.getElementById('join-match');
        if (joinMatch) {
            joinMatch.onclick = () => {
                console.log('listing matches');
                this.emitter.next({ action: 'listMatches', details: '0' });
            };
        }*/
    }

    getMatches(response: Match[]) {
        this.state.matches = response;
        this.currentScreen = 'joinMatch';
        console.log(response);
        let matches: string = response.reduce((total, current) => {
            return total += `<div id="match-${current.owner}">${current.owner}</div>`
        }, '');
        matches += '<div id="main-menu-back">Back</div>';
        const mainMenuContent = document.getElementById('main-menu-content');
        if (mainMenuContent) {
            mainMenuContent.innerHTML = matches;
        }
        const mainMenuBasck = document.getElementById('main-menu-back');
        if (mainMenuBasck) {
            mainMenuBasck.onclick = () => this.populateMainMenu();
        }
        response.forEach(element => {
            const match = document.getElementById(`match-${element.owner}`);
            if (match) {
                match.onclick = () => this.emitter.next({ action: 'joinMatch', details: element.owner });
            }
        });
    };

    joinMatch(match: Match) {
        this.currentMatch = match;
        this.currentScreen = 'room';
        /*
        let matchStatus = '';
        //let matchStatus = `<div id="owner"><input type="checkbox" id="${match.owner}" class="" readonly disabled />Owner: ${match.owner}</div>`;
        for (let i = 0; i < match.maxPlayers; i++) {
            if (match.players[i]) {
                if (match.players[i].status === 'ready') {
                    matchStatus += `<div id="other"><div id="owner"><input type="checkbox" id="${match.players[i].id}" class="" readonly disabled checked />Guest: ${match.players[i].id}</div>`;
                }
                else {
                    matchStatus += `<div id="other"><div id="owner"><input type="checkbox" id="${match.players[i].id}" class="" readonly disabled />Guest: ${match.players[i].id}</div>`;
                }
            } else {
                matchStatus += `<div>EMPTY</div>`;
            }
        }
        const countPlayersReady = match.players.reduce((playersReady, player) => {
            console.log('players ready: ' + playersReady + '\n player: ' + JSON.stringify(player));
            if (player.status === 'ready') {
                return playersReady + 1;
            }
            else {
                return playersReady;
            }

        }, 0);
        if (match.owner === this.username) {
            matchStatus += `<div style="margin-top:10px;"><input type="button" value="Start!" style="test-align:center;" ${countPlayersReady !== match.players.length && 'disabled'}  id="startButton"  /></div>`;
            matchStatus += '<div id="main-menu-cancel">Cancel</div>';
            const mainMenuContent = document.getElementById('main-menu-content');
            if (mainMenuContent) {
                mainMenuContent.innerHTML = matchStatus;
            }

            const button = (document.getElementById('startButton') as any);
            button.onclick = () => this.startGame();
        }
        matchStatus += '<div id="main-menu-back">Back</div>';

        matchStatus += `<div>${countPlayersReady}/${match.players.length}</div>`;
        const mainMenuContent = document.getElementById('main-menu-content');
        if (mainMenuContent) {
            mainMenuContent.innerHTML = matchStatus;
        }
        const element = (document.getElementById(this.username) as any);
        element.disabled = false;
        element.readonly = false;
        element.onchange = (event: any) => this.ready(event);

        const mainMenuBack = document.getElementById('main-menu-back');
        if (mainMenuBack) {
            mainMenuBack.onclick = () => this.populateMainMenu();
        }
        if (match.owner === this.username) {
            const mainMenuCancel = document.getElementById('main-menu-cancel');
            if (mainMenuCancel) {
                mainMenuCancel.onclick = () => {
                    this.emitter.next({ action: 'closeMatch', details: match.owner });
                    this.populateMainMenu();
                };
            }
        }
        */
    }

    ready(e: any) {
        if (e.target.checked === true) {
            this.updateStatus("ready");
        }
        else {
            this.updateStatus("waiting");
        }
    }

    updateStatus(status: string) {
        this.emitter.next({
            action: 'playerReady',
            details: this.currentMatch.id.toString() + '\n' + this.username.toString() + '\n' + status
        })
    }


    startGame() {
        this.emitter.next({
            action: 'startGame',
            details: this.currentMatch.id.toString()
        })
    }

}