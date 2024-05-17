import { useEffect, useMemo, useState } from 'react';
import arbiter from '../../arbiter/arbiter';
import { useAppContext }from '../../contexts/Context'
import { generateCandidates } from '../../reducer/actions/move';
import { PlayerTurn, startGame } from '../../utils/InitialTurn';

const Piece = ({
    rank,
    file,
    piece,
}) => {
    const playerData=startGame();
    const playerturn=PlayerTurn();
    const nextPlayerColour=playerturn?.nextPlayerColour
    const nextPlayerId=playerturn?.nextPlayerId;
    const { appState, dispatch } = useAppContext();
    const { turn, castleDirection, position : currentPosition } = appState
    const [playernextTurn,setPlayerNextTurn]=useState(playerData?.nextPlayerColour);
    const [playernextId,setPlayerNextId]=useState(playerData?.nextPlayerTurn);
   
   
    const playerId = localStorage.getItem('playerId')
    console.log(playernextTurn,playernextId,"player next turn");
useEffect(()=>{
    if(playerturn){
        setPlayerNextTurn(nextPlayerColour)
        setPlayerNextId(nextPlayerId)
    }
},[playerturn])

    const onDragStart = e => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain",`${piece},${rank},${file}`)
        setTimeout(() => {
            e.target.style.display = 'none'
        },0)
       
        if (turn===playernextTurn && playerId=== playernextId ){
            console.log("Player turn rotate ho gaya",playernextTurn,playernextId);
            const candidateMoves = 
                arbiter.getValidMoves({
                    position : currentPosition[currentPosition.length - 1],
                    prevPosition : currentPosition[currentPosition.length - 2],
                    castleDirection : castleDirection[turn],
                    piece,
                    file,
                    rank
                })
            dispatch(generateCandidates({candidateMoves}))
        }

    }
    const onDragEnd = e => {
       e.target.style.display = 'block'
     }
 
    return (
        <div 
            className={`piece ${piece} p-${file}${rank}`}
            draggable={true}   
            onDragStart={onDragStart} 
            onDragEnd={onDragEnd}

        />)
}

export default Piece