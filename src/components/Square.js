import React, { useState } from 'react';

const Square = ({ square, position, onClick, isSelected}) => {

    const [highlighted, setHighlighted] = useState(isSelected);

    //Gets Unicode representation of piece
    const getPieceSymbol = () => {
        if (square.color === 'white') {
            switch (square.piece) {
                case 'Pawn':
                    return '\u2659';
                case 'Bishop':
                    return '\u2657';
                case 'Knight':
                    return '\u2658';
                case 'Rook':
                    return '\u2656';
                case 'Queen':
                    return '\u2655';
                case 'King':
                    return '\u2654';
                default:
                    break;
            }
        }
        else {
            switch (square.piece) {
                case 'Pawn':
                    return '\u265F';
                case 'Bishop':
                    return '\u265D';
                case 'Knight':
                    return '\u265E';
                case 'Rook':
                    return '\u265C';
                case 'Queen':
                    return '\u265B';
                case 'King':
                    return '\u265A';
                default:
                    break;
            }

        }

        return '';
    }

    return (
        <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: isSelected ? 'yellow' : ((position[0] + position[1]) % 2 === 0) ? 'white' : 'gray',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }} onClick={onClick}>
            <p style={{ fontSize: '3em' }}>{square === null ? '' : getPieceSymbol()}</p>
        </div>
    )
}

export default Square;