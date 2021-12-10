import React, { useState, useEffect } from 'react';
import Square from './Square';
import { PromotePawnOverlay } from './PromotePawnOverlay';
import ChessFactory from '../model/Chess';

const Board = ({ chess }) => {

    const [board, setBoard] = useState(chess.board);
    const [selectedSquare, setSelectedSquare] = useState('');
    //this is used to promote pawns - if it is true, waits for user to select piece to promote to
    const [promotePawn, setPromotePawn] = useState(chess.awaitingPawnPromotion);

    //This happens when pawn needs to be promoted
    useEffect(() => {
        setPromotePawn(chess.awaitingPawnPromotion);
    }, [chess.awaitingPawnPromotion])

    //This happens when the game ends
    useEffect(() => {
        if (chess.gameOver) alert(`Game over - ${chess.turn === 'white' ? 'black': 'white'} wins!`);
    }, [chess.gameOver])

    //Determines whether to change selectedSquare
    const handleClick = (x, y) => {
        //If not waiting to promote pawn
        if (!promotePawn) {
        //If player clicks on a piece of their own color
            if (board[x][y] !== null && board[x][y].color === chess.turn) {
                setSelectedSquare([x, y]);
            } //If selectedSquare isn't set and player hasn't clicked on a piece of their own color
            else if (selectedSquare === '') {
                return;
            } else {
                let move = chess.handleMove(selectedSquare, [x, y]);
                setSelectedSquare('');
            }
        }
    }

    const handlePiecePromotion = (selectedPromotion) => {
        chess.promotePawn(selectedPromotion);
        setPromotePawn(false);
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh'}}>
            <div style={{borderStyle: 'solid', borderWidth: '1.75px'}}>
                {board.map((column, y) => {
                    return (
                        <div style={{ display: 'flex' }}>
                            {column.map((square, x) => {
                                //row is 7 - y to make white on the bottom and black on top
                                //essentially iterates from top of board (black) down (white)
                                return <Square square={board[x][7 - y]} position={[x, y]} onClick={() => handleClick(x, 7 - y)} isSelected={((selectedSquare[0] === x) && (selectedSquare[1] === 7 - y)) ? true : false} />
                            })}
                            <br />
                        </div>
                    )
                })}
            </div>
            {promotePawn ? <PromotePawnOverlay turn={chess.turn} handleClick={handlePiecePromotion} /> : null}
        </div>
    )
}

export default Board;