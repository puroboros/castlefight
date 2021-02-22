export enum MainMenuActionTypes {
    CLOSE_MATCH_REQUEST = '[CLOSE_MATCH_REQUEST]',
    CLOSE_MATCH_RESPONSE = '[CLOSE_MATCH_RESPONSE]',
    CREATE_MATCH_REQUEST = '[CREATE_MATCH_REQUEST]',
    CREATE_MATCH_RESPONSE = '[CREATE_MATCH_RESPONSE]',
    LIST_MATCHES_REQUEST = '[LIST_MATCHES_REQUEST]',
    LIST_MATCHES_RESPONSE = '[LIST_MATCHES_RESPONSE]',
    JOIN_MATCH_REQUEST = '[JOIN_MATCH_REQUEST]',
    JOIN_MATCH_RESPONSE = '[JOIN_MATCH_RESPONSE]',
    NAVIGATE = '[NAVIGATE]',
}

export type CloseMatchResponseAction = {
    type: MainMenuActionTypes.CLOSE_MATCH_RESPONSE;
}
export type CreateMatchRequestAction = {
    type: MainMenuActionTypes.CREATE_MATCH_REQUEST;
}
export type CreateMatchResponseAction = {
    type: MainMenuActionTypes.CREATE_MATCH_RESPONSE;
    response: any;
}
export type ListMatchesRequestAction = {
    type: MainMenuActionTypes.LIST_MATCHES_REQUEST;
}
export type ListMatchesResponseAction = {
    type: MainMenuActionTypes.LIST_MATCHES_RESPONSE;
    response: any;
}
export type JoinMatchRequestAction = {
    type: MainMenuActionTypes.JOIN_MATCH_REQUEST;
    matchId: number;
}
export type JoinMatchResponseAction = {
    type: MainMenuActionTypes.JOIN_MATCH_RESPONSE;
    response: any;
}
export type NavigateAction = {
    type: MainMenuActionTypes.NAVIGATE;
    page: string;
}

export type MainMenuActions =
    CloseMatchResponseAction |
    CreateMatchRequestAction |
    CreateMatchResponseAction |
    ListMatchesRequestAction |
    ListMatchesResponseAction |
    JoinMatchRequestAction |
    JoinMatchResponseAction |
    NavigateAction;
