import React, { useReducer } from 'react'
import TakeBack from '../components/Control/bits/TakeBack'
import MovesList from '../components/Control/bits/MovesList'
import Control from '../components/Control/Control'
import Board from '../components/Board/Board'
import AppContext from '../contexts/Context'
import { reducer } from '../reducer/reducer'
import { initGameState } from '../constants'
import '../App.css'

function Game() {
  const [appState, dispatch ] = useReducer(reducer,initGameState);

  const providerState = {
      appState,
      dispatch
  }

  return (
    <AppContext.Provider value={providerState} >
    <div className="App">
        <Board/>
        <Control>
          
            <MovesList/>
            <TakeBack/>
        </Control>
    </div>
</AppContext.Provider>
  )
}

export default Game