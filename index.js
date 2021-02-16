const BoardDiv = document.querySelector("#Board");

class Board1D {
    constructor(boardDiv) {
        this.boardDiv = boardDiv;
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
            let square = document.createElement("div");
            square.classList.add("boardSquare");
            
            if (i%2 == 0) {
                square.classList.add("darkSquare");
            } else {
                square.classList.add("lightSquare");
            }

            square.id = "Square-" + i;

            this.boardDiv.appendChild(square)

            this.boardSquares[i] = new Square(this, i)
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
                this.boardSquares[location].piece = new Pawn(this.boardSquares[location], team);
                break;
            case "rook":
                this.boardSquares[location].piece = new Rook(this.boardSquares[location], team);
                break;
            case "bishop":
                this.boardSquares[location].piece = new Bishop(this.boardSquares[location], team);
                break;
            case "knight":
                this.boardSquares[location].piece = new Knight(this.boardSquares[location], team);
                break;  
            case "queen":
                this.boardSquares[location].piece = new Queen(this.boardSquares[location], team);
                break;
            case "king":
                this.boardSquares[location].piece = new King(this.boardSquares[location], team);
                break;
        }
        if (team == "white") {
            if (piece_name == "king") this.whiteKing = this.boardSquares[location].piece
            this.whitePieces.push(this.boardSquares[location].piece);
        } else {
            if (piece_name == "king") this.blackKing = this.boardSquares[location].piece
            this.whitePieces.push(this.boardSquares[location].piece);
        }
        this.boardSquares[location].updateImg()
    }

    checkForCheck() {
        for (let i=0; i < this.boardSquares.length; i++) {
            if(this.boardSquares[i].piece != null) {
                console.log(this.boardSquares[i].piece)
                if (this.boardSquares[i].piece.team == "white" && this.boardSquares[i].piece.canMove(this.blackKing.square.location)) return true;
                if (this.boardSquares[i].piece.team == "black" && this.boardSquares[i].piece.canMove(this.whiteKing.square.location)) return true;
            }
        }
    }

}

class Square{
    constructor(board ,location, piece = null) {
        this.board = board;
        this.piece = piece;

        this.location = location;
        this.selected = false;
        
        this.squareDiv = document.querySelector("#Square-" + location);
        this.squareDiv.addEventListener("click", () =>
            this.selected = toggleSelect(this)
        )
    }
    deselect() {
        if (this.location%2 == 0) {
            this.squareDiv.classList.add("darkSquare");
        } else {
            this.squareDiv.classList.add("lightSquare");
        }
    }
    updateImg() {
        if (this.piece == null && this.squareDiv.firstChild != undefined) {
            this.squareDiv.removeChild(this.squareDiv.firstChild);
            return;
        }

        this.squareDiv.appendChild(this.piece.pieceImg)
    }

    isWhite() {
        return this.location%2 != 0;
    }

}

function toggleSelect(square) {
    
    if (square.selected) {
        square.squareDiv.classList.remove("selectedSquare");
        square.board.selectedSquaresNumber -= 1;
        square.deselect();
        return false;
        
    } else {
        if(square.board.selectedSquaresNumber >= 1) {
            square.board.getSelected().piece.move(square.location);
            square.board.cleanSelected();
            return square.selected;
        };
        square.board.selectedSquaresNumber += 1;
        square.squareDiv.classList.remove("darkSquare");
        square.squareDiv.classList.remove("lightSquare");
        square.squareDiv.classList.add("selectedSquare");
        return true;
    }
}

let Game = new Board1D(BoardDiv);


Game.addPiece(0, "king", "white")
Game.addPiece(1, "queen", "white")
Game.addPiece(2, "rook", "white")
Game.addPiece(3, "bishop", "white")
Game.addPiece(4, "knight", "white")
Game.addPiece(5, "pawn", "white")

Game.addPiece(10, "pawn", "black")
Game.addPiece(11, "knight", "black")
Game.addPiece(12, "bishop", "black")
Game.addPiece(13, "rook", "black")
Game.addPiece(14, "queen", "black")
Game.addPiece(15, "king", "black")

