import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { all } from 'redux-saga/effects'
import mainMenuSaga from '../../main-menu/redux/main-menu.saga';
import { MainMenuReducer, MainMenuStateType } from '../../main-menu/redux/main-menu.reducer';

export type State = {
	MainMenuReducer: MainMenuStateType
}

export const reducers = combineReducers(
	{
		MainMenuReducer
	}
);

export const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, composeWithDevTools(
	compose(
		applyMiddleware(
			sagaMiddleware,
		),
	)));

export default store;

function* rootSaga() {
	yield all([
		mainMenuSaga()
	])
}

sagaMiddleware.run(rootSaga);