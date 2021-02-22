import { takeLatest } from 'redux-saga/effects';
import gameCoordinator from '../../game-coordinator/game-coordinator';
import { CreateMatchRequestAction, MainMenuActionTypes, JoinMatchRequestAction } from './main-menu.action.types';

export function* createMatchEffect(action: CreateMatchRequestAction) {
	gameCoordinator.sendToMenu({ action: 'createMatch', details: 0 });
}

export function* joinMatchEffect(action: JoinMatchRequestAction) {
	gameCoordinator.sendToMenu({ action: 'joinMatch', details: action.matchId });
}

function* mainMenuSaga() {
	yield takeLatest(MainMenuActionTypes.CREATE_MATCH_REQUEST, createMatchEffect);
}

export default mainMenuSaga;
