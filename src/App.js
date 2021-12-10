import React, {useState, useEffect} from 'react';
import ChessFactory from './model/Chess.js';
import Board from './components/Board';

import './App.css';

const App = () => {

    const [chess, setChess] = useState(ChessFactory());
    const [moveHistory, setMoveHistory] = useState(chess.moveHistory);

    useEffect(() => {
        setMoveHistory(chess.moveHistory)
    }, [chess.moveHistory])

    //{`${key}. ${move}`}
    return (
        <div>
            <Board chess={chess} />
            <div>
                {chess.moveHistory.map((move, key) => {
                    return <p key={key}>test</p>
                })}
            </div>
        </div>
    );
}

export default App;