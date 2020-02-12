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
        this.currentMatch = match;
        let matchStatus = `<div id="owner"><input type="checkbox" id="${match.player1.id}" class="" readonly disabled />Owner: ${match.player1.id}</div>`;
        for(let i = 0; i < match.maxPlayers; i++){
            if (match.players[i]) {
                
                matchStatus += `<div id="other"><div id="owner"><input type="checkbox" id="${match.players[i].id}" class="" readonly disabled />Guest: ${match.players[i].id}</div>`;
                document.getElementById(match.players[i].id).onclick = (event) =>  this.ready(event);
            } else {
                matchStatus += `<div>Guest: Waiting</div>`;
            }
        }

        if(match.player1.id === this.connector.username){
            matchStatus += '<input type="button" value="Start!"  disabled>'    
        }
        matchStatus += '<div id="main-menu-back">Back</div>';
        matchStatus+= '<div>0</div>'
        document.getElementById('main-menu-content').innerHTML = matchStatus;
        const element = (document.getElementById(this.connector.username) as any);
        element.disabled = false;
        element.readonly=false;
        
        document.getElementById('main-menu-back').onclick = () => this.populateMainMenu();
        
    }

    ready(e: any){
        if(e.target.value === true){
            this.updateStatus("ready");
        }
        else{
            this.updateStatus("waiting");
        }
    }

    updateStatus(status: string){
        this.connector.send({
            action:'playerReady',
            details: this.currentMatch.id.toString() + '\n' + this.connector.username.toString() + '\n' + status
        })
    }
}