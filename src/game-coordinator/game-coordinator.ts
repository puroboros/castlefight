import { SocketConnector, Match } from '../connection';
import store from '../core/store/store';
import { MenuLayout } from '../main-menu/init';
import { joinMatchResponseAction, createMatchResponseAction, listMatchesResponseAction, closeGameAction } from '../main-menu/redux/main-menu.actions';
import { View } from '../view/view';

export class GameCoordinator {
    private game?: Match;
    public menu: MenuLayout;
    public view: View;
    constructor(private connection: SocketConnector, view: View, menu: MenuLayout) {
        this.menu = menu;
        this.view = view;
        view.eventEmitter.subscribe(event => {
            switch (event.action) {
                case 'moveUnit':
                    if (this.game) {
                        event.details = this.game.id + '\n' + event.details;
                    }
                    connection.sendToGame(event);
                    break;
                default:
                    console.error('no', event);
                    break;
            }
        });
        connection.gameSelection.subscribe(response => {
            console.log('pepino: ', response);
            switch (response.method) {
                case 'menu':
                    // menu.getMatches(response.content as Match[]);
                    store.dispatch(listMatchesResponseAction((response.content as Match[])) as any);
                    break;
                case 'create':
                    this.game = response.content as any;
                    console.log('this.game ', this.game);
                    store.dispatch(createMatchResponseAction(response.content as Match) as any)
                    // menu.joinMatch(response.content as any);
                    break;
                case 'closeMatch':
                    store.dispatch(closeGameAction() as any);
                    break;
                case 'join':
                    if (response.content) {
                        this.game = response.content as any;
                        console.log('this.game ', this.game);
                        store.dispatch(joinMatchResponseAction((response.content as Match)) as any);
                        // menu.joinMatch(response.content as any);
                    }
                    break;
                case 'joined':
                    menu.joinMatch((response.content as Match[])[0]);
                    store.dispatch(joinMatchResponseAction((response.content as Match)) as any);
                    break;
                case 'updateStatus':
                    store.dispatch(joinMatchResponseAction((response.content as Match)) as any);
                    break;
                default:
                    break;
            }
        });

        connection.gameEvent.subscribe(event => {
            console.log('pepino: ' + event);
        });

        connection.connected.subscribe(() => {
            menu.username = connection.username;
        });

        menu.menuEventEmitter.subscribe((event: { action: string, details: string }) => {
            switch (event.action) {
                case 'createMatch':
                    connection.send(event);
                    break;
                case 'listMatches':
                    connection.send(event);
                    break;
                case 'closeMatch':
                    connection.send(event);
                    break;
                case 'playerReady':
                    connection.send(event);
                    break;
                case 'startGame':
                    connection.send(event);
                    break;
                case 'joinMatch':
                    connection.send(event);
                    break;
                default:
                    console.error('unrecognized event: ', event);
                    break;
            }
        });
    }

    sendToMenu(message: any) {
        this.connection.send(message);
    }

    connect(){
        this.connection.connect();
    }

}
const connector = new SocketConnector();
const menuLayout = new MenuLayout();
const view = new View();
const gameCoordinator = new GameCoordinator(connector, view, menuLayout);
export default gameCoordinator;