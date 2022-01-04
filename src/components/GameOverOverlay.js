import React from 'react';

export const GameOverOverlay = ({ winner }) => {
    return (
        <div style={{
            width: '450px',
            paddingLeft: '25px',
            paddingRight: '25px',
            backgroundColor: 'lightgray',
            opacity: 1,
            position: 'fixed',
            textAlign: 'center'
        }}>
            <h3 style={{fontSize: '1.5em'}}>Game over! {winner} wins!</h3>
        </div>
    )
}
