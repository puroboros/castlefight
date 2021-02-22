import { useSelector } from 'react-redux';
import { Match } from "../../connection";
import { State } from "../../core/store/store";
import { MainMenuActionTypes, MainMenuActions } from "./main-menu.action.types";

export type MainMenuStateType = {
    readonly availableMatches: Match[];
    readonly currentScreen: string;
    readonly selectedMatch: Match;
}
const initialState: MainMenuStateType = {
    availableMatches: [],
    currentScreen: 'joinCreate',
    selectedMatch: {
        players: [],
        owner: '',
        maxPlayers: 0,
        status: '',
        id: 0,
        troops: []
    }
}

const fillMatchWithEmptySlotsAndPutOwnerFirst = (match: Match): Match => {
    for (let i = match.players.length; i < match.maxPlayers; ++i) {
        match.players.push({ id: '', race: '', status: '', gold: 0, wood: 0, activeBuilding: 0, activeTroops: 0 });
    }
    return match;
}

export const MainMenuReducer = (state = initialState, action: MainMenuActions): MainMenuStateType => {
    console.log('MainMenuReducer received action: ', action);
    switch (action.type) {
        case MainMenuActionTypes.CLOSE_MATCH_RESPONSE:
            return {...state, currentScreen: 'joinCreate'};
        case MainMenuActionTypes.CREATE_MATCH_REQUEST:
            return { ...state };
        case MainMenuActionTypes.CREATE_MATCH_RESPONSE:
            return { ...state, currentScreen: 'room', selectedMatch: fillMatchWithEmptySlotsAndPutOwnerFirst(action.response) };
        case MainMenuActionTypes.JOIN_MATCH_REQUEST:
            return { ...state };
        case MainMenuActionTypes.JOIN_MATCH_RESPONSE:
            return { ...state, currentScreen: 'room', selectedMatch: fillMatchWithEmptySlotsAndPutOwnerFirst(action.response) };
        case MainMenuActionTypes.LIST_MATCHES_RESPONSE:
            return { ...state, currentScreen: 'rooms', availableMatches: action.response };
        case MainMenuActionTypes.NAVIGATE:
            return { ...state, currentScreen: action.page }
        default:
            return { ...state };
    }
}

export const useMainMenuReducerCurrentScreen = () => useSelector((state: State) => state.MainMenuReducer.currentScreen);
export const useMainMenuReducerSelectedMatch = () => useSelector((state: State) => state.MainMenuReducer.selectedMatch);
export const useMainMenuReducerAvailableMatches = () => useSelector((state: State) => state.MainMenuReducer.availableMatches);