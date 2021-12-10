
const PawnFactory = (color) => {

    //Generates moves in a certain direction in increments
    const generateMoves = (board, position, color) => {
        let moves = [];
        let x = position[0];
        let y = position[1];
        //White pawns go up, black pawns go down
        let direction = (color === 'white') ? 1 : -1;

        //Makes sure movement is within bounds
        if (y + direction < 8 && y + direction >= 0) {
            //Move forward if square is open
            if (board[x][y + direction] === null) {
                moves.push([position, [x, y + direction]]);
            }
            //Diagonally capture piece to the left 
            if (x - 1 >= 0 && board[x - 1][y + direction] !== null && board[x - 1][y + direction].color !== color) {
                moves.push([position, [x - 1, y + direction]]);
            }
            //Diagonally capture piece to the right
            if (x + 1 < 8 && board[x + 1][y + direction] !== null && board[x + 1][y + direction].color !== color) {
                moves.push([position, [x + 1, y + direction]]);
            }
        }
        //Double move for initial pawn move
        if (y + 2 * direction < 8 && y + 2 * direction >= 0 && board[x][y + 2 * direction] === null && ((color === 'white' && y === 1) || (color === 'black' && y === 6))) {
            moves.push([position, [x, y + 2 * direction]]);
        }

        return moves;
    }

    return {
        color: color,
        piece: 'Pawn',

        //Position a two value array starting from lower left quadrant
        getMoves(board, position) {
            let moves = [];

            moves = moves.concat(generateMoves(board, position, this.color));

            return moves;
        }
    }
}

export default PawnFactory;