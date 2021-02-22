import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Match } from '../../../connection';
import { Context } from '../../../core/context/context';
import { navigateAction } from '../../redux/main-menu.actions';
import { useMainMenuReducerAvailableMatches } from '../../redux/main-menu.reducer';
import styles from './list-rooms.module.scss';

const ListRooms = () => {
    const gameCoordinator = useContext(Context);
    const matches = useMainMenuReducerAvailableMatches();
    const dispatch = useDispatch();
    const joinMatch = (id: string) => {
        gameCoordinator.menu.emitter.next({ action: 'joinMatch', details: id });
    }
    const back = () => {
        dispatch(navigateAction('joinCreate'));
    }
    return (
        <div className={styles.main}>
            <h1 className={styles.title}> Rooms</h1>
            <div>
                {matches.map((match: Match, index: number) =>
                    <div key={index} onClick={() => joinMatch(match.owner)}>{match.owner} {match.players.length}/{match.maxPlayers}</div>
                )}
            </div>
            <div onClick={back}>
                Back
            </div>
        </div>
    );
}
export default ListRooms;