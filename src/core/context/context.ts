import React from 'react';
import gameCoordinator, { GameCoordinator } from '../../game-coordinator/game-coordinator';

export const Context = React.createContext<GameCoordinator>(gameCoordinator);
export const ContextProvider = Context.Provider;
