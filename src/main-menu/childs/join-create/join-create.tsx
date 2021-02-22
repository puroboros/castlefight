import React, { useContext, useEffect } from 'react';
import { Context } from '../../../core/context/context';
import styles from './join-create.module.scss';

const JoinCreateComponent = () => {
    const gameCoordinator = useContext(Context);
    const createMatch = () => {
        gameCoordinator.menu.emitter.next({ action: 'createMatch', details: '0' });
    }
    const joinMatch = () => {
        gameCoordinator.menu.emitter.next({ action: 'listMatches', details: '0' });
    }
    return (
        <div className={styles.main}>
            <div id="create-match" onClick={createMatch}>Create Match</div>
            <div id="join-match" onClick={joinMatch}>Join Match</div>
        </div>
    );
}

export default JoinCreateComponent;