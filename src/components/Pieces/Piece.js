import { useEffect, useMemo, useState } from 'react';
import arbiter from '../../arbiter/arbiter';
import { useAppContext }from '../../contexts/Context'
import { generateCandidates } from '../../reducer/actions/move';
import { PlayerId, PlayerTurn, startGame } from '../../utils/InitialTurn';

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
    const [newPosition, setNewPosition] = useState([]);
    const initialPosition=startGame();
   
    const playerId = PlayerId();
 
    
    useEffect(() => {
        const storedPosition = JSON.parse(localStorage.getItem("newPosition"));
        if (storedPosition?.newPosition) {
            const position = [...newPosition, storedPosition.newPosition];
            setNewPosition(position);           
        } else {
            const updatedPosition = [...newPosition, initialPosition?.createPosition];
            setNewPosition(updatedPosition);
        }
    }, [currentPosition]);
    
    useMemo(()=>{
        if(playerturn){
            setPlayerNextTurn(nextPlayerColour)
            setPlayerNextId(nextPlayerId) 
            
        }
        if (  playernextTurn!==piece[0] && playerId === playernextId ){
            console.log((newPosition.length?newPosition:currentPosition)[ (newPosition.length?newPosition:currentPosition).length - 1],"yyyyyyyy");
            console.log( (newPosition.length?newPosition:currentPosition)[  (newPosition.length?newPosition:currentPosition).length - 2],"4343432423353245435235");
            const candidateMoves = 
               arbiter.getValidMoves({
                   position :  (newPosition.length?newPosition:currentPosition)[  (newPosition.length?newPosition:currentPosition).length - 1],
                   prevPosition :  (newPosition.length?newPosition:currentPosition)[  (newPosition.length?newPosition:currentPosition).length - 2],
                   castleDirection : castleDirection[playernextTurn?playernextTurn:turn],
                   piece,
                   file,
                   rank
               })
           dispatch(generateCandidates({candidateMoves}))
          
       }

        
    },[nextPlayerId,nextPlayerColour])
  
    const onDragStart = e => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain",`${piece},${rank},${file}`)
        setTimeout(() => {
            e.target.style.display = 'none'
        },0)
       
        console.log("Player turn rotate ho gaya",playerId,playernextTurn,playernextId,turn);
  
        console.log("Status", playernextTurn===piece[0] && playerId === playernextId  );
        if (  playernextTurn===piece[0] && playerId === playernextId ){
             const candidateMoves = 
                arbiter.getValidMoves({
                    position : (newPosition?newPosition:currentPosition)[ (newPosition?newPosition:currentPosition).length - 1],
                    prevPosition :  (newPosition?newPosition:currentPosition)[ (newPosition?newPosition:currentPosition).length - 2],
                    castleDirection : castleDirection[playernextTurn],
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