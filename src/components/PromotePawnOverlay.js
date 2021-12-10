import React from 'react';
import './PromotePawnOverlay.css'

export const PromotePawnOverlay = ({ turn, handleClick }) => {
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
            <h3 style={{fontSize: '1.5em'}}>Promote</h3>
            <div style={{
                display: 'flex',
                height: '3em',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 0,
                marginBottom: '5%'
            }}>
                <p className='promotePawnOverlay-p' onClick={() => handleClick('bishop')}>{turn === 'white' ? '\u2657' : '\u265D'}</p>
                <p className='promotePawnOverlay-p' onClick={() => handleClick('knight')}>{turn === 'white' ? '\u2658' : '\u265E'}</p>
                <p className='promotePawnOverlay-p' onClick={() => handleClick('rook')}>{turn === 'white' ? '\u2656' : '\u265C'}</p>
                <p className='promotePawnOverlay-p' onClick={() => handleClick('queen')}>{turn === 'white' ? '\u2655' : '\u265B'}</p>
            </div>
        </div>
    )
}
