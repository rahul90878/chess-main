export const startGame=()=>{
    const turn=JSON.parse(localStorage.getItem('startGame'))
    return turn
}

export const PlayerTurn=()=>{
    const nextplayer=JSON.parse(localStorage.getItem('nextplayerTurn'))
    return nextplayer;
}



