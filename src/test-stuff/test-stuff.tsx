import React from 'react';

import { SocketConnector } from '../connection';

import gameCoordinator from '../game-coordinator/game-coordinator';
import { ContextProvider } from '../core/context/context';
import styles from './test-stuff.module.scss';
import { dispatch } from 'rxjs/internal/observable/range';
import { navigateAction } from '../main-menu/redux/main-menu.actions';
import { useDispatch } from 'react-redux';
type TestStuffProps = {
  setTest:(state:boolean)=>void;
}
export const TestStuff=({setTest}:TestStuffProps)=>{

  const dispatch = useDispatch();

  const exitTest = ()=>{
    gameCoordinator.view.deleteScene();
    dispatch(navigateAction('joinCreate'));
    setTest(true);
  }

  return (
    <>
      {gameCoordinator && <ContextProvider value={gameCoordinator}>
        <div id="toaster"></div>
        <div style={{ position: 'absolute' }} className={styles.container}>
          <div className={'buttonsMoveCamera'}>
            <button id="leftcam" onClick={()=>gameCoordinator.view.moveCamToLeft()}>&lt;</button>
            <button id="rightcam"  onClick={()=>gameCoordinator.view.moveCamToRight()}>&gt;</button>
            <button id="upcam" onClick={()=>gameCoordinator.view.moveCamToUp()}>^</button>
            <button id="downcam" onClick={()=>gameCoordinator.view.moveCamToDown()}>v</button>
          </div>

          <div className={'buttonsMoveCamera'}>
            <button id="zoomout" onClick={()=>gameCoordinator.view.moveCamToFarther()}>+</button>
            <button id="zoomin" onClick={()=>gameCoordinator.view.moveCamToCloser()}>-</button>
            <button id="centercam" onClick={()=>gameCoordinator.view.centerCamera()}>*</button>
          </div>

          <div className={'buttonsMoveCamera'}>
            <button id="cameralooktoleft" onClick={()=>gameCoordinator.view.cameraLooktoLeft()}>izk</button>
            <button id="cameralooktoright" onClick={()=>gameCoordinator.view.cameraLooktoRight()}>der</button>
            <button id="cameralooktoup" onClick={()=>gameCoordinator.view.cameraLooktoUp()}>arr</button>
            <button id="cameralooktodown" onClick={()=>gameCoordinator.view.cameraLooktoDown()}>aba</button>
            <button id="cameralookreset" onClick={()=>gameCoordinator.view.cameraLookReset()}>cent</button>
          </div>

          <div className={'buttonsMoveCamera'}>
            <button id="addSprite" onClick={()=>gameCoordinator.view.addSprite()}>new</button>
            <button id="removeSprite" onClick={()=>gameCoordinator.view.removeSprite()}>remove</button>
            <button id="flipSprite" onClick={()=>gameCoordinator.view.flipSprite()}>flip</button>
            <button id="changeSpriteAction+" onClick={()=>gameCoordinator.view.changeSpriteAction()}>action+</button>
          </div>

          
          <div className={'textBoxs'}>
            <input type="text" size={1} id="selectedSprite" value="Gos 1" />
            <input type="text" size={1} id="selectedAnimation" />
            <input type="text" size={30} id="spritePos" />
          </div>

          <div className={'buttonsMoveCamera'}>
            <button id="fullscreen" onClick={()=>gameCoordinator.view.fullScreen()}>o</button>
            <button id="closefullscreen" onClick={()=>gameCoordinator.view.closeFullScreen()}>x</button>
            <button id="backButton" onClick={exitTest}>back</button>
          </div>
        </div>
      </ContextProvider>}

    </>
  );
}

