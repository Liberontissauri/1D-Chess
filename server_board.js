let Square = require("./server_square");
let Pieces = require("./server_pieces");

class Board1D {
    constructor() {
        this.boardSquares = [];

        this.selectedSquaresNumber = 0;
        this.selectedSquare = null;

        this.whitePieces = [];
        this.blackPieces = [];

        this.whiteKing = undefined;
        this.blackKing = undefined;

        this.generateSquares();
    }

    generateSquares() {
        for(let i = 0;i < 16; i++) {
            this.boardSquares[i] = new Square.Square(this, i)
        }
    }
    getSelected() {
        this.boardSquares.forEach(square => {
            if (square.selected == true) {
                this.selectedSquare = square;
            };
        });

        return this.selectedSquare;
    }

    cleanSelected() {
        this.boardSquares.forEach(square => {
            square.selected = false;
            square.squareDiv.classList.remove("selectedSquare");
            square.deselect()
        });
        this.selectedSquaresNumber = 0;
    }

    addPiece(location, piece_name = "pawn", team) {
        switch (piece_name){
            case "pawn":
                this.boardSquares[location].piece = new Pieces.Pawn(this.boardSquares[location], team);
                break;
            case "rook":
                this.boardSquares[location].piece = new Pieces.Rook(this.boardSquares[location], team);
                break;
            case "bishop":
                this.boardSquares[location].piece = new Pieces.Bishop(this.boardSquares[location], team);
                break;
            case "knight":
                this.boardSquares[location].piece = new Pieces.Knight(this.boardSquares[location], team);
                break;  
            case "queen":
                this.boardSquares[location].piece = new Pieces.Queen(this.boardSquares[location], team);
                break;
            case "king":
                this.boardSquares[location].piece = new Pieces.King(this.boardSquares[location], team);
                break;
        }
        if (team == "white") {
            if (piece_name == "king") this.whiteKing = this.boardSquares[location].piece
            this.whitePieces.push(this.boardSquares[location].piece);
        } else {
            if (piece_name == "king") this.blackKing = this.boardSquares[location].piece
            this.whitePieces.push(this.boardSquares[location].piece);
        }
    }

    checkForCheck(moveTeam) {
        for (let i=0; i < this.boardSquares.length; i++) {
            if(this.boardSquares[i].piece != null) {
                
                if (this.boardSquares[i].piece.team == "white" && moveTeam != this.boardSquares[i].piece.team && this.boardSquares[i].piece.canMove(this.blackKing.square.location)) return true;
                if (this.boardSquares[i].piece.team == "black" && moveTeam != this.boardSquares[i].piece.team && this.boardSquares[i].piece.canMove(this.whiteKing.square.location)) return true;
            }
        }
    }

    getPieces() {
        let piece_array = []
        this.boardSquares.forEach(square => {
            let piece = {};
            if (square.piece != null) {
                piece["name"] = square.piece.name;
                piece["team"] = square.piece.team;
            } else {
                piece = null;
            }
            
            piece_array[square.location] = piece;
        });
        return piece_array;
    }

    updateBoard(piece_array) {
        this.cleanBoard();
        this.boardSquares.forEach(square => {
            if (piece_array[square.location] != null) {
                this.addPiece(square.location, piece_array[square.location].name, piece_array[square.location].team)
            }
        });
    }

    cleanBoard() {
        this.boardSquares.forEach(square => {
            square.cleanSquare();
        });
    }
}

module.exports.Board1D = Board1D;
