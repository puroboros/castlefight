import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Player } from '../../../connection';
import { Context } from '../../../core/context/context';
import gameCoordinator from '../../../game-coordinator/game-coordinator';
import { navigateAction } from '../../redux/main-menu.actions';
import { useMainMenuReducerSelectedMatch } from '../../redux/main-menu.reducer';
import styles from './game-room.module.scss';
const GameRoom = () => {
    const context = useContext(Context);
    const username = context.menu.username;
    const match = useMainMenuReducerSelectedMatch();
    const dispatch = useDispatch();
    console.log('GameRoom match: ', match);
    const ready = (event: any) => {
        context.sendToMenu({
            action: 'playerReady',
            details: match.id.toString() + '\n' + username + '\n' + (event.target.checked ? 'ready' : 'waiting')
        })
    }
    const back = () => {
        dispatch(navigateAction('joinCreate'));
    }
    const cancelMatch = () => {
        context.sendToMenu({ action: 'closeMatch', details: match.owner });
        back();
    }

    const startGame = () => {
        context.sendToMenu({ action: 'startGame', details: match.id});
        dispatch(navigateAction('game'));
    }
    return (<div className={styles.main}>
        {match.players.map((player: Player, index: number) =>
            <div key={index}>
                {player.id
                    ? <> <input type="checkbox" disabled={player.id !== username} checked={player.status === 'ready'} onChange={ready} />Guest: {player.id}</>
                    : <>EMPTY</>}
            </div>)}
        {match.owner === username &&<>
            {(!match.players.some(player => player.status!=='ready' && player.id)) ?
                <div onClick={startGame}>
                    Start
                </div>:
                <div>
                    Not Ready Yet
                </div>
            }
            <div onClick={cancelMatch}>
                Cancel
            </div></>

        }
        <div onClick={back}>
            Back
        </div>
    </div>);
}

export default GameRoom;