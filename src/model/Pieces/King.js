
const KingFactory = (color) => {

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
        piece: 'King',

        //Position a two value array starting from lower left quadrant
        getMoves(board, position) {
            let moves = [];

            //Moves right
            moves = moves.concat(generateMoves(board, position, color, 1, 0));
            //Moves left
            moves = moves.concat(generateMoves(board, position, color, -1, 0));
            //Moves up
            moves = moves.concat(generateMoves(board, position, color, 0, 1));
            //Moves down
            moves = moves.concat(generateMoves(board, position, color, 0, -1));
            //Moves up and right
            moves = moves.concat(generateMoves(board, position, color, 1, 1));
            //Moves up and left
            moves = moves.concat(generateMoves(board, position, color, 1, -1));
            //Moves down and right
            moves = moves.concat(generateMoves(board, position, color, -1, 1));
            //Moves down and left
            moves = moves.concat(generateMoves(board, position, color, -1, -1));
            
            return moves;
        }
    }
}

export default KingFactory;