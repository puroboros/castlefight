import React, { useEffect, useState } from 'react';

import './App.css';
import { TestStuff } from './test-stuff/test-stuff';
import gameCoordinator from './game-coordinator/game-coordinator';
import { ContextProvider } from './core/context/context';
import MainMenu from './main-menu/main-menu';
import { useMainMenuReducerCurrentScreen } from './main-menu/redux/main-menu.reducer';
import { useDispatch } from 'react-redux';
import { navigateAction } from './main-menu/redux/main-menu.actions';

function App() {
  const [test, setTest] = useState(true);
  const page = useMainMenuReducerCurrentScreen();
  const dispatch = useDispatch();

  const renderScene = () => {
    dispatch(navigateAction('test'));
    gameCoordinator.view.initScene();
    setTest(false);
  }

  useEffect(() => { console.log('app ', page) }, [page]);
  return (
    <>
      <ContextProvider value={gameCoordinator}>
        <div>
          {page !== 'test' && page !== 'game' ?
            <> {page !== 'game' && <button id="testStuff" onClick={renderScene}>test</button>}
              <div>
                <MainMenu></MainMenu>
              </div>:
              <div>
                <label htmlFor="id">ID {page}</label>
                <input type="text" name="id"></input>
                <label htmlFor="password">Password</label>
                <input type="text" name="password"></input>
                <button id="Login" onClick={() => gameCoordinator.connect()}>Login</button>
              </div>
            </> :
            <TestStuff setTest={setTest}></TestStuff>}
        </div>
      </ContextProvider>
    </>
  );

}

export default App;
