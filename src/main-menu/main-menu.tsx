import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../core/context/context';
import GameRoom from './childs/game-room/game-room';
import JoinCreateComponent from './childs/join-create/join-create';
import ListRooms from './childs/list-rooms/list-rooms';
import styles from './main-menu.module.css';
import { useMainMenuReducerCurrentScreen } from './redux/main-menu.reducer';

const MainMenu = () => {
    const page = useMainMenuReducerCurrentScreen();
    console.log('MainMenu woilol ', page);
    return (
        <>
            {page && <div className={styles.mainMenu}>
                <div className={styles.mainMenuContent}>
                    {page === 'joinCreate' && <JoinCreateComponent ></JoinCreateComponent>}
                    {page === 'room' && <GameRoom ></GameRoom>}
                    {page === 'rooms' && <ListRooms ></ListRooms>}
                </div>
            </div>}
        </>
    );
}
export default MainMenu;