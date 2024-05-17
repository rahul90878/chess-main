import React, { useEffect, useReducer, useState } from 'react'


import { useNavigate } from 'react-router-dom'


import { reducer } from '../reducer/reducer';
import { initGameState } from '../constants';
import socket from '../socket';

function Room() {
    localStorage.clear();
    const [appState, dispatch ] = useReducer(reducer,initGameState);
    const [playerId,setPlayerId]=useState()
    const [playerName,setPlayerName]=useState()
const navigate=useNavigate()
    // useEffect(()=>{
    //     setPlayerId(playerId)
    //     setPlayerName(playerName)

    // },[playerId,playerName])
   

    const HandleSubmit=()=>{
       
    
        if(playerId && playerName){
            const Joinroom={
                "playerId" : playerId,
                "name" : playerName,
                "totalCoin" : 0,
                "coin": 10,
                "profileImageUrl" : "null",
                "playerStatus" : "Good"
            }
            // console.log(Joinroom,"hhhhhhhhhhhhh");
          
            localStorage.clear();
            localStorage.setItem('playerId',playerId)
            localStorage.setItem('playerName',playerName)
            socket.emit('joinRoom',Joinroom)
          console.log("Please wait for other player");
           
        }
        

    }
    
   
    
    socket.on('updatedRoom', data => {
        console.log('Received updated room data:',data?._id);
        localStorage.setItem("RoomId",data?._id)
        // dispatch(updatedRoom(data))
       
    });
    socket.on('startGame', data => {
        console.log('Received start data:',data);
        localStorage.setItem("startGame",JSON.stringify(data))
        navigate('/game')
    });
   



    return (
        <div
            style={{}}>

            <form  >
                <fieldset>
                    <legend>Join Room Form:</legend>
                    <label htmlFor="pid">Player Id</label>
                    <input type="text" value={playerId ? playerId:""}  onChange={e=>setPlayerId(e.target.value)} id="pid" name="pid" /><br /><br />
                    <label htmlFor="pname">Player name:</label>
                    <input type="text" value={playerName ? playerName:""}  onChange={e=>setPlayerName(e.target.value)} id="pname" name="pname" /><br /><br/>
                        {/* <label for="email">Email:</label>
                        <input type="email" id="email" name="email" /><br /><br />
                        <label for="birthday">Birthday:</label>
                        <input type="date" id="birthday" name="birthday" /><br /><br /> */}
                        {/* <input type="submit" value="Submit" /> */}
                        <button type='button' onClick={HandleSubmit} >Join Room</button>
                </fieldset>
            </form>
        </div>
    )
}

export default Room