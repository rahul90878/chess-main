export const startGame=()=>{
    const turn=JSON.parse(localStorage.getItem('startGame'))
    return turn
}
export const PlayerId=()=>{
   
    return  localStorage.getItem('playerId')
}

export const PlayerTurn=()=>{
    const nextplayer=JSON.parse(localStorage.getItem('nextplayerTurn'))
    return nextplayer;
}



