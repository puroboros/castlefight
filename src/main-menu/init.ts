import { SocketConnector } from '../connection';

export class MenuLayout {
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
            return total += `<div id="match-${current.player1.id}">${current.player1.id}</div>`
        }, '');
        matches += '<div id="main-menu-back">Back</div>';
        document.getElementById('main-menu-content').innerHTML = matches;
        document.getElementById('main-menu-back').onclick = () => this.populateMainMenu();
        (response as Array<any>).forEach(element => {
            document.getElementById(`match-${element.player1.id}`).onclick = () => this.connector.send({ action: 'joinMatch', details: element.player1.id });
        });
    };

    joinMatch(match: any) {
        let matchStatus = `<div id="owner">Owner: ${match.player1.id}</div>`;
        if (match.player2) {
            matchStatus += `<div id="other">Guest: ${match.player2.id}</div>`;
        } else {
            matchStatus += `<div id="other">Guest: Waiting</div>`;
        }
        matchStatus += '<div id="main-menu-cancel">Cancel</div>';
        matchStatus += '<div id="main-menu-back">Back</div>';
        document.getElementById('main-menu-content').innerHTML = matchStatus;
        document.getElementById('main-menu-back').onclick = () => this.populateMainMenu();
        document.getElementById('main-menu-cancel').onclick = () => {
            this.connector.send({action: 'closeMatch', details: match.player1.id});
            this.populateMainMenu();
        };
    }
}