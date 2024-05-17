import { createPosition } from './helper'
import {  startGame } from './utils/InitialTurn';


export const Status = {
    'ongoing' : 'Ongoing',
    'promoting' : 'Promoting',
    'white' : 'White wins',
    'black' : 'Black wins',
    'stalemate' : 'Game draws due to stalemate',
    'insufficient' : 'Game draws due to insufficient material',
}

let turndata=startGame()
console.log(turndata,"oooooooooooooo");
export const initGameState = {

    position : [createPosition()],
    turn : turndata?.nextPlayerColour,
    candidateMoves : [],
    movesList : [],

    promotionSquare : null,
    status : Status.ongoing,
    castleDirection : {
        w : 'both',
        b : 'both'
    }, 
}