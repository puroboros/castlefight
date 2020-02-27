import { SocketConnector } from '../connection';

export class MenuLayout {
    private currentMatch: any;
    private connector: SocketConnector;
    constructor(connector: SocketConnector) {
        this.connector = connector;
        this.populateMainMenu();
        console.log('olis');
        this.connector.gameSelection.subscribe((response: any) => {
            console.log('inside menu log constructor ' + response.content);
            switch ((response as any).method) {
                case 'menu':
                    this.getMatches((response as any).content);
                    break;
                case 'create':
                    this.joinMatch((response as any).content);
                    break;
                case 'join':
                    if ((response as any).content !== 'error') {
                        this.joinMatch((response as any).content);
                    }
                    break;
                case 'joined':
                    this.joinMatch((response as any).content);
                    break;
                case 'updateStatus':
                    this.joinMatch((response as any).content);
                    break;
                default:
                    break;
            }
        });
    }


    populateMainMenu() {
        document.getElementById('main-menu-content').innerHTML =
            `<div id="create-match">Create Match</div>
            <div id="join-match">Join Match</div>`;
        document.getElementById('create-match').onclick = () => {
            console.log('creating match');
            this.connector.send({ action: 'createMatch', details: '0' });
        };
        document.getElementById('join-match').onclick = () => {
            console.log('listing matches');
            this.connector.send({ action: 'listMatches', details: '0' });
        };
    }

    getMatches(response: object) {
        console.log(response);
        let matches: string = (response as Array<any>).reduce((total, current) => {
            return total += `<div id="match-${current.owner}">${current.owner}</div>`
        }, '');
        matches += '<div id="main-menu-back">Back</div>';
        document.getElementById('main-menu-content').innerHTML = matches;
        document.getElementById('main-menu-back').onclick = () => this.populateMainMenu();
        (response as Array<any>).forEach(element => {
            document.getElementById(`match-${element.owner}`).onclick = () => this.connector.send({ action: 'joinMatch', details: element.owner });
        });
    };

    joinMatch(match: any) {
        this.currentMatch = match;
        let matchStatus;
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
        if (match.owner === this.connector.username) {
            matchStatus += `<div style="margin-top:10px;"><input type="button" value="Start!" style="test-align:center;" ${countPlayersReady !== match.players.length && 'disabled'}  id="startButton"  /></div>`;
            matchStatus += '<div id="main-menu-cancel">Cancel</div>';
        }
        matchStatus += '<div id="main-menu-back">Back</div>';

        matchStatus += `<div>${countPlayersReady}/${match.players.length}</div>`;
        document.getElementById('main-menu-content').innerHTML = matchStatus;
        const element = (document.getElementById(this.connector.username) as any);
        element.disabled = false;
        element.readonly=false;
        element.onchange = (event) =>  this.ready(event);
        const button = (document.getElementById('startButton') as any);
        button.onclick = (event) =>  this.startGame();
        
        document.getElementById('main-menu-back').onclick = () => this.populateMainMenu();
        if (match.owner === this.connector.username) {
            document.getElementById('main-menu-cancel').onclick = () => {
                this.connector.send({ action: 'closeMatch', details: match.owner });
                this.populateMainMenu();
            };
        }
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
        this.connector.send({
            action: 'playerReady',
            details: this.currentMatch.id.toString() + '\n' + this.connector.username.toString() + '\n' + status
        })
    }


    startGame(){
        this.connector.send({
            action:'startGame',
            details: this.currentMatch.id.toString()
        })
    }

}