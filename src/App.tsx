import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { SocketConnector } from './connection';
import { MenuLayout } from './main-menu/init';
import { View } from './view/view';
import gameCoordinator from './game-coordinator/game-coordinator';
import { Context, ContextProvider } from './core/context/context';
import MainMenu from './main-menu/main-menu';
function App() {
  let connector: SocketConnector;

  return (
    <>
      {gameCoordinator && <ContextProvider value={gameCoordinator}>
        <div id="toaster"></div>
        <div style={{ position: 'absolute' }}>
          <button id="leftcam">&lt;</button>
          <button id="rightcam">&gt;</button>
          <button id="zoomout">+</button>
          <button id="zoomin">-</button>
          <button id="upcam">^</button>
          <button id="downcam">v</button>
          <button id="centercam">*</button>
          <button id="fullscreen">o</button>
          <button id="closefullscreen">x</button>
          <button id="changeSpriteAction+">action+</button>
          <input type="text" size={1} id="selectedSprite" value="Gos 1" />
          <input type="text" size={1} id="selectedAnimation" />
          <button id="addSprite">new</button>
          <button id="removeSprite">remove</button>
          <button id="flipSprite">flip</button>
          <input type="text" size={30} id="spritePos" />
        </div>
        <MainMenu></MainMenu>
      </ContextProvider>}

    </>
  );
}

export default App;
