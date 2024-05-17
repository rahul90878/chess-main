import './Pieces.css'
import Piece from './Piece'
import { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../contexts/Context'
import { openPromotion } from '../../reducer/actions/popup'
import { getCastlingDirections } from '../../arbiter/getMoves'
import { updateCastling, detectStalemate, detectInsufficientMaterial, detectCheckmate } from '../../reducer/actions/game'

import { makeNewMove, clearCandidates } from '../../reducer/actions/move'
import arbiter from '../../arbiter/arbiter'
import { getNewMoveNotation } from '../../helper'
import socket from '../../socket'
import { startGame } from '../../utils/InitialTurn'



const Pieces = () => {

    const { appState, dispatch } = useAppContext();
    const currentPosition = appState.position[appState.position.length - 1]
    const playerId = localStorage.getItem('playerId')
    const RoomId = localStorage.getItem('RoomId')
    const [position, setPosition] = useState([])
    const initialPosition=startGame();

    const ref = useRef()
    useEffect(() => {
        setPosition(initialPosition?.createPosition)
    }, [])
    console.log('position', position);
    const updateCastlingState = ({ piece, file, rank }) => {
        const direction = getCastlingDirections({
            castleDirection: appState.castleDirection,
            piece,
            file,
            rank
        })
        if (direction) {
            dispatch(updateCastling(direction))
        }
    }

    const openPromotionBox = ({ rank, file, x, y }) => {
        dispatch(openPromotion({
            rank: Number(rank),
            file: Number(file),
            x,
            y
        }))
    }

    const calculateCoords = e => {
        const { top, left, width } = ref.current.getBoundingClientRect()
        const size = width / 8
        const y = Math.floor((e.clientX - left) / size)
        const x = 7 - Math.floor((e.clientY - top) / size)

        return { x, y }
    }

    const gamestart = () => {
        console.log("socket called");
        //socket implement
        // socket.on('nextplayerTurn', data => {
        //     console.log('Next player:', data);

        // });

        socket.emit('doardData', { roomId: RoomId, playerId: playerId, doardData: { currentPosition }, });
        // socket.on('receive_doardData', data => {
        //     console.log(data, "jjjjjjjjjjj");
        //     setPosition(data?.currentPosition)
        //     // dispatch(currentPosition(data))

        // })
        // end socket
    }

    const move = e => {
        const { x, y } = calculateCoords(e)
        const [piece, rank, file] = e.dataTransfer.getData("text").split(',')

        if (appState.candidateMoves.find(m => m[0] === x && m[1] === y)) {
            const opponent = piece.startsWith('b') ? 'w' : 'b'
            const castleDirection = appState.castleDirection[`${piece.startsWith('b') ? 'white' : 'black'}`]

            if ((piece === 'wp' && x === 7) || (piece === 'bp' && x === 0)) {
                openPromotionBox({ rank, file, x, y })
                return
            }
            if (piece.endsWith('r') || piece.endsWith('k')) {
                updateCastlingState({ piece, file, rank })
            }
            const newPosition = arbiter.performMove({
                position: currentPosition,
                piece, rank, file,
                x, y
            })
            const newMove = getNewMoveNotation({
                piece,
                rank,
                file,
                x,
                y,
                position: currentPosition,
            })
            dispatch(makeNewMove({ newPosition, newMove }))

       
            if (arbiter.insufficientMaterial(newPosition))
                dispatch(detectInsufficientMaterial())
            else if (arbiter.isStalemate(newPosition, opponent, castleDirection)) {
                dispatch(detectStalemate())
            }
            else if (arbiter.isCheckMate(newPosition, opponent, castleDirection)) {
                dispatch(detectCheckmate(piece[0]))
            }

        }
        dispatch(clearCandidates())
    }

    const onDrop = e => {
        e.preventDefault()

        move(e)
        gamestart();
     

    }

    const onDragOver = e => {
        e.preventDefault()



    }
    socket.on('receive_doardData', data => {
        console.log(data, "jjjjjjjjjjj");
        setPosition(data?.currentPosition)
        // dispatch(currentPosition(data))

    })
    socket.on('nextplayerTurn', data => {
        console.log('Next player:', data);
        localStorage.setItem('nextplayerTurn',JSON.stringify(data))

    });
    return <div
        className='pieces'
        ref={ref}
        onDrop={onDrop}
        onDragOver={onDragOver} >
        {position.map((r, rank) =>
            r.map((f, file) =>
                position[rank][file]
                    ? <Piece
                        key={rank + '-' + file}
                        rank={rank}
                        file={file}
                        piece={position[rank][file]}
                    />
                    : null
            )
        )}
    </div>
}

export default Pieces