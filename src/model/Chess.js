import PawnFactory from "./Pieces/Pawn";
import RookFactory from "./Pieces/Rook";
import KnightFactory from "./Pieces/Knight";
import BishopFactory from "./Pieces/Bishop";
import QueenFactory from "./Pieces/Queen";
import KingFactory from "./Pieces/King";
import deepCopy from "./core/deepCopy";

const ChessFactory = () => {

    const initializeBoard = () => {
        return ([
            [RookFactory('white'), PawnFactory('white'), null, null, null, null, PawnFactory('black'), RookFactory('black')],
            [KnightFactory('white'), PawnFactory('white'), null, null, null, null, PawnFactory('black'), KnightFactory('black')],
            [BishopFactory('white'), PawnFactory('white'), null, null, null, null, PawnFactory('black'), BishopFactory('black')],
            [QueenFactory('white'), PawnFactory('white'), null, null, null, null, PawnFactory('black'), QueenFactory('black')],
            [KingFactory('white'), PawnFactory('white'), null, null, null, null, PawnFactory('black'), KingFactory('black')],
            [BishopFactory('white'), PawnFactory('white'), null, null, null, null, PawnFactory('black'), BishopFactory('black')],
            [KnightFactory('white'), PawnFactory('white'), null, null, null, null, PawnFactory('black'), KnightFactory('black')],
            [RookFactory('white'), PawnFactory('white'), null, null, null, null, PawnFactory('black'), RookFactory('black')],
        ]);
    };

    //Generates list of moves given a board setup and the color of the current turn
    //Checks if player is in check after move
    const generateImmediateMoves = (board, turn) => {

        let movesList = [];

        for (let x = 0; x < 8; x = x + 1) {
            for (let y = 0; y < 8; y = y + 1) {
                if (board[x][y] !== null && board[x][y].color === turn) {
                    let position = [x, y];
                    movesList = movesList.concat(board[x][y].getMoves(board, position));
                }
            }
        }

        return movesList;
    }

    //Generates list of legal moves, given the current turn and board
    //Legal move takes the form of [initialPosition, finalPosition]
    const generateLegalMovesList = (board, turn, moveHistory) => {
        let legalMovesList = generateImmediateMoves(board, turn);

        let illegalMovesList = [];


        //Adds castling moves
        checkForCastle(board, turn, moveHistory).forEach(castleMove => {
            if (castleMove.length > 0) legalMovesList.push(castleMove);
        });

        checkForEnPassant(board, turn, moveHistory).forEach(enPassantMove => {
            if (enPassantMove.length > 0) legalMovesList.push(enPassantMove);
        })

        //Loops through all moves and generates a new board for after each move
        //Checks if player is in check 
        //If any of the opposing player's possible moves on the new board attack the player's king, move is illegal
        //Adds illigal moves to illegalMovesList, then removes moves in illegalMovesList from movesList
        for (let i = 0; i < legalMovesList.length; i = i + 1) {
            let possibleMove = legalMovesList[i];
            let resultingBoard = deepCopy(board);
            let positionOfKingOnResultingBoard;
            let nextTurn = (turn === 'white') ? 'black' : 'white';

            //resultingBoard is the board after the current move being looped has been played
            //resultingBoard[move[1][0]][move[1][1]] = resultingBoard[move[0][0]][move[0][1]];
            //resultingBoard[move[0][0]][move[0][1]] = null;
            if (typeof possibleMove[0] === 'string') {
                move(possibleMove[0], possibleMove[1][0], possibleMove[1][1], resultingBoard)
            } else {
                move('normal', possibleMove[0], possibleMove[1], resultingBoard)
            }

            //Gets location of current player's king on resultingBoard
            for (let x = 0; x < 8; x = x + 1) {
                for (let y = 0; y < 8; y = y + 1) {
                    if (resultingBoard[x][y] !== null && resultingBoard[x][y].color === turn && resultingBoard[x][y].piece === 'King') {
                        positionOfKingOnResultingBoard = [x, y];
                    }
                }
            }

            let inCheck = false;

            let nextTurnMovesList = generateImmediateMoves(resultingBoard, nextTurn);

            nextTurnMovesList.forEach(move => {
                if (JSON.stringify(move[1]) === JSON.stringify(positionOfKingOnResultingBoard)) inCheck = true;
            });

            if (inCheck) illegalMovesList.push(legalMovesList[i]);

        };


        //Filters movesList to only include moves that are not in illegalMovesList
        legalMovesList = legalMovesList.filter((move) => !illegalMovesList.includes(move));

        return legalMovesList
    }

    //Checks if there are any castling moves
    const checkForCastle = (board, turn, moveHistory) => {

        let legalCastlingMoves = [];

        let ARookInitialPosition = turn === 'white' ? [0, 0] : [0, 7];
        let HRookInitialPosition = turn === 'white' ? [7, 0] : [7, 7];
        let kingInitialPosition = turn === 'white' ? [4, 0] : [4, 7];

        //King castling long
        if (castleMoveLegal(kingInitialPosition, ARookInitialPosition, board, turn, moveHistory)) {
            legalCastlingMoves.push(
                //2D move. First is king, second is rook
                ['castle', [kingInitialPosition, [kingInitialPosition[0] - 2, kingInitialPosition[1]]], [ARookInitialPosition, [ARookInitialPosition[0] + 3, ARookInitialPosition[1]]]]
            );
        }

        //King castling short
        if (castleMoveLegal(kingInitialPosition, HRookInitialPosition, board, turn, moveHistory)) {
            legalCastlingMoves.push(
                //2D move. First is king, second is rook
                ['castle', [kingInitialPosition, [kingInitialPosition[0] + 2, kingInitialPosition[1]]], [HRookInitialPosition, [HRookInitialPosition[0] - 2, ARookInitialPosition[1]]]]
            );
        }

        return legalCastlingMoves;
    }

    //Checks if castling move is legal, given rook/king pair to castle
    const castleMoveLegal = (kingInitialPosition, rookInitialPosition, board, turn, moveHistory) => {

        let kingHasMoved = hasPieceMoved(kingInitialPosition, moveHistory);
        let rookHasMoved = hasPieceMoved(rookInitialPosition, moveHistory);

        if (!kingHasMoved && !rookHasMoved) {
            let squaresKingGoesThrough = [];
            //Are there pieces between king and rook?
            let squaresBetweenOccupied = false;

            //Adds king's initial position
            squaresKingGoesThrough.push(kingInitialPosition);

            //Loops through all squares between x value of king's initial position and rook's initial position
            for (let x = kingInitialPosition[0] > rookInitialPosition[0] ? kingInitialPosition[0] - 1 : rookInitialPosition[0] - 1; x !== 4 && x !== 0; x = x - 1) {
                //King moves two squares. If square is within 2 of king initial square, push to squaresKingGoesThrough
                if (Math.abs(kingInitialPosition[0] - x) <= 2) squaresKingGoesThrough.push([x, kingInitialPosition[1]]);
                //If square has a piece, the squares between are occupied
                if (board[x][kingInitialPosition[1]] !== null) squaresBetweenOccupied = true;
            }

            //if no positions between them have a piece, check if any squares the king passes are in check
            if (!squaresBetweenOccupied) {
                //Generates other player's moves
                let otherTurnMoves = generateImmediateMoves(board, (turn === 'white') ? 'black' : 'white');
                let anyKingSquaresInCheck = false;
                otherTurnMoves.forEach(move => {
                    squaresKingGoesThrough.forEach(squareKingGoesThrough => {
                        if (JSON.stringify(move[1]) === JSON.stringify(squareKingGoesThrough)) anyKingSquaresInCheck = true;
                    });
                });

                //Only returns true if 1) no pieces are between and 2) no squares the king goes through are in check
                //Already checked for no pieces between, so returns value of statement "no squares the king goes through are in check"
                return anyKingSquaresInCheck === false;
            }
        } else {
            return false;
        }

        //Need logic to handle castling moves in legalMovesList
        //Probably just if any move is a 2d array, both moves are made
        //Since castling should really only be the only move with two moves
        //Unless pawn promotion also has two moves? 
    }

    //Checks if there are any en passant moves
    const checkForEnPassant = (board, turn, moveHistory) => {

        let possibleEnPassantMoves = [];
        //Y value pawns can en passant from, depending on piece color
        let y = turn === 'white' ? 4 : 3;

        //for each pawn
        for (let x = 0; x < 8; x = x + 1) {
            if (board[x][y] !== null && board[x][y].piece === 'Pawn' && board[x][y].color === turn) {
                let opposingColorPawnInitialRank = turn === 'white' ? 6 : 1;
                //if the square is occupied by a pawn of the opposing color
                if (x + 1 < 8 && board[x + 1][y] !== null && board[x + 1][y].piece === 'Pawn' && board[x + 1][y].color !== turn) {
                    //First checks if the last move started on back rank, second checks if the last move ended next to the piece
                    if (moveHistory[moveHistory.length - 1][0][1] === opposingColorPawnInitialRank && (moveHistory[moveHistory.length - 1][1][0] === x + 1 && moveHistory[moveHistory.length - 1][1][1] === y)) {
                        //don't have to worry about a piece being in the spot, because the most recent pawn move passed over it
                        let newY = turn === 'white' ? 5 : 2;
                        possibleEnPassantMoves.push(['en passant', [[x, y], [x + 1, newY]]]);
                    }
                } else if (x - 1 > 0 && board[x - 1][y] !== null && board[x - 1][y].piece === 'Pawn' && board[x - 1][y].color !== turn) {
                    if (moveHistory[moveHistory.length - 1][0][1] === opposingColorPawnInitialRank && (moveHistory[moveHistory.length - 1][1][0] === x - 1 && moveHistory[moveHistory.length - 1][1][1] === y)) {
                        //don't have to worry about a piece being in the spot, because the most recent pawn move passed over it
                        let newY = turn === 'white' ? 5 : 2;
                        possibleEnPassantMoves.push(['en passant', [[x, y], [x - 1, newY]]]);
                    }
                }
            }
        }

        return possibleEnPassantMoves;
    }

    //Checks if piece has moved, given initial position and history of moves
    const hasPieceMoved = (initialPosition, moveHistory) => {
        let hasMoved = false;

        moveHistory.forEach(move => {
            if (JSON.stringify(move[0]) === JSON.stringify(initialPosition)) hasMoved = true;
        });

        return hasMoved;
    }

    //Checks if move is in list of legal moves
    //Returns string. String can be 'invalid', 'normal', 'castle', 'en passant'
    const moveIsInMovesList = (position1, position2, movesList) => {

        let moveInMovesList = 'invalid';

        movesList.forEach(move => {
            if (JSON.stringify(move) === JSON.stringify([position1, position2])) moveInMovesList = 'normal';
            //Checks for castling or en passant, which are 2D arrays
            //Type of move is stored at move[0]
            if (typeof move[0] === 'string' && JSON.stringify(move[1]) === JSON.stringify([position1, position2])) moveInMovesList = move[0];
        });

        return moveInMovesList;
    }

    //Makes move on board, adds move to history
    const move = (moveType, position1, position2, board) => {
        switch (moveType) {
            case 'normal':
                //Sets position2 equal to value of position1
                board[position2[0]][position2[1]] = board[position1[0]][position1[1]];
                //Clears position1
                board[position1[0]][position1[1]] = null;
                break;
            case 'castle':
                //Moves king
                board[position2[0]][position2[1]] = board[position1[0]][position1[1]];
                //Set original king position to null
                board[position1[0]][position1[1]] = null;
                //Move rooks based on side castling to (found based on position2[0], which gives column king moves to)
                //Position2[1] will always give the row
                //Castle long
                if (position2[0] === 2) {
                    //Moves rook
                    board[3][position2[1]] = board[0][position2[1]];
                    //Sets rook initial position to null
                    board[0][position2[1]] = null;
                }
                //Castle short
                else {
                    //Moves rook
                    board[5][position2[1]] = board[7][position2[1]];
                    //Sets rook initial position to null
                    board[7][position2[1]] = null;
                }
                break;
            case 'en passant':
                let yIncrement = position1[1] === 4 ? -1 : 1;
                board[position2[0]][position2[1]] = board[position1[0]][position1[1]];
                board[position1[0]][position1[1]] = null;
                board[position2[0]][position2[1] + yIncrement] = null;
                break;
            default:
                break;
        }
    }

    return Object.create({
        board: initializeBoard(),
        turn: 'white',
        legalMovesList: generateImmediateMoves(initializeBoard(), 'white'),
        moveHistory: [],
        awaitingPawnPromotion: false,
        gameOver: false,

        //I'll need to add functions for castling/converting pawn on end rank (should both of those go here?)
        handleMove(position1, position2) {

            let moveType = moveIsInMovesList(position1, position2, this.legalMovesList);
            //If move is in list of legal moves
            if (moveType !== 'invalid') {
                //Makes move on board
                move(moveType, position1, position2, this.board, this.moveHistory);

                //Adds move to move history
                this.moveHistory.push([position1, position2]);

                //If there is a pawn on one of the back ranks, needs to be promoted
                if ((position2[1] === 0 || position2[1] === 7) && this.board[position2[0]][position2[1]].piece === 'Pawn') {
                    this.awaitingPawnPromotion = true;
                }

                //Ends turn
                if (!this.awaitingPawnPromotion) this.endTurn();

            }
        },
        promotePawn(piece) {
            let lastMove = this.moveHistory[this.moveHistory.length - 1][1];
            switch (piece) {
                case 'bishop':
                    this.board[lastMove[0]][lastMove[1]] = BishopFactory(this.turn);
                    break;
                case 'knight':
                    this.board[lastMove[0]][lastMove[1]] = KnightFactory(this.turn);
                    break;
                case 'rook':
                    this.board[lastMove[0]][lastMove[1]] = RookFactory(this.turn);
                    break;
                case 'queen':
                    this.board[lastMove[0]][lastMove[1]] = QueenFactory(this.turn);
                    break;
                default:
                    break;
            }
            this.awaitingPawnPromotion = false;
            this.endTurn();
        },
        endTurn() {
            //Changes turn
            this.turn === 'white' ? this.turn = 'black' : this.turn = 'white';

            //Re-generates movesList for new board and turn
            this.legalMovesList = generateLegalMovesList(this.board, this.turn, this.moveHistory);

            //if there are no legal moves, the turn at the beginning of the function wins
            if (this.legalMovesList.length === 0) this.gameOver = true;
        }
    })

}

export default ChessFactory;