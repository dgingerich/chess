
const QueenFactory = (color) => {

    //Generates moves in a certain direction in increments
    const generateIncrementalMoves = (board, position, color, xincrement, yincrement) => {
        let moves = [];
        let x = position[0] + xincrement;
        let y = position[1] + yincrement;
        let encounteredPiece = false;

        //Keeps adding moves until square is out of bounds or a piece is encountered
        while (x >= 0 && x < 8 && y >= 0 && y < 8 && !encounteredPiece) {
            //If the space is not empty
            if (board[x][y] !== null) {
                encounteredPiece = true;
                //If the enocountered piece is not of the same color as this piece, add as a legal move
                if (board[x][y].color !== color) {
                    moves.push([position, [x, y]]);
                }
            } //If the space is empty add as a legal move 
            else {
                moves.push([position, [x, y]]);
            }
            //increment x and y
            x = x + xincrement;
            y = y + yincrement;
        }

        return moves;
    }
    
    return {
        color: color,
        piece: 'Queen',

        //Position a two value array starting from lower left quadrant
        getMoves(board, position) {
            let moves = [];

            //Moves right
            moves = moves.concat(generateIncrementalMoves(board, position, color, 1, 0));
            //Moves left
            moves = moves.concat(generateIncrementalMoves(board, position, color, -1, 0));
            //Moves up
            moves = moves.concat(generateIncrementalMoves(board, position, color, 0, 1));
            //Moves down
            moves = moves.concat(generateIncrementalMoves(board, position, color, 0, -1));
            //Moves up and right
            moves = moves.concat(generateIncrementalMoves(board, position, color, 1, 1));
            //Moves up and left
            moves = moves.concat(generateIncrementalMoves(board, position, color, 1, -1));
            //Moves down and right
            moves = moves.concat(generateIncrementalMoves(board, position, color, -1, 1));
            //Moves down and left
            moves = moves.concat(generateIncrementalMoves(board, position, color, -1, -1));

            return moves;
        }
    }
}

export default QueenFactory;