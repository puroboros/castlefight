import { Match } from "../../connection";
import { MainMenuActionTypes } from "./main-menu.action.types";

export const createMatchAction = () => ({
    type: MainMenuActionTypes.CREATE_MATCH_REQUEST
});
export const createMatchResponseAction = (match: Match) => ({
    type: MainMenuActionTypes.CREATE_MATCH_RESPONSE,
    response: match
});
export const joinMatchResponseAction = (match: Match) => ({
    type: MainMenuActionTypes.JOIN_MATCH_RESPONSE,
    response: match
});
export const listMatchesResponseAction = (matches: Match[]) => ({
    type: MainMenuActionTypes.LIST_MATCHES_RESPONSE,
    response: matches
});
export const navigateAction = (page: string) => ({
    type: MainMenuActionTypes.NAVIGATE,
    page
});
export const closeGameAction = () => ({
    type: MainMenuActionTypes.CLOSE_MATCH_RESPONSE
})