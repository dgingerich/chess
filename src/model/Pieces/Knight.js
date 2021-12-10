
const KnightFactory = (color) => {

    //Generates moves in a certain direction in increments
    const generateMoves = (board, position, color, xincrement, yincrement) => {
        let moves = [];
        let x = position[0] + xincrement;
        let y = position[1] + yincrement;

        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
            //If the space is not empty
            if (board[x][y] !== null) {
                if (board[x][y].color !== color) {
                    moves.push([position, [x, y]]);
                }
            } //If the space is empty add as a legal move 
            else {
                moves.push([position, [x, y]]);
            }
        }

        return moves;
    }

    return {
        color: color,
        piece: 'Knight',

        //Position a two value array starting from lower left quadrant
        getMoves(board, position) {
            let moves = [];
            //Moves up and right
            moves = moves.concat(generateMoves(board, position, color, 1, 2));
            //Moves up and left
            moves = moves.concat(generateMoves(board, position, color, -1, 2));
            //Moves right and up
            moves = moves.concat(generateMoves(board, position, color, 2, 1));
            //Moves right and down
            moves = moves.concat(generateMoves(board, position, color, 2, -1));
            //Moves down and right
            moves = moves.concat(generateMoves(board, position, color, 1, -2));
            //Moves down and left
            moves = moves.concat(generateMoves(board, position, color, -1, -2));
            //Moves left and up
            moves = moves.concat(generateMoves(board, position, color, -2, 1));
            //Moves left and down
            moves = moves.concat(generateMoves(board, position, color, -2, -1));
            return moves;
        }
    }
}

export default KnightFactory;