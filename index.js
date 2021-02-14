const BoardDiv = document.querySelector("#Board");

class Board1D {
    constructor(boardDiv) {
        this.boardDiv = boardDiv;
        this.boardSquares = [];

        this.selectedSquaresNumber = 0;
        this.selectedSquare = null;

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
                this.boardSquares[location].piece = new Pawn(this.boardSquares[location], team)
        }
        this.boardSquares[location].updateImg()
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

class Piece {
    constructor(square, team){
        this.square = square;
        this.team = team;
        this.name = null;
    }

    canMove(location){
        if (location >= 0 && location <=15) {
            return true;
        } else {
            return false;
        }
    }

    move(location) {
        if(this.canMove(location)) {

            this.square.piece = null;
            this.square.updateImg()
            this.square = this.square.board.boardSquares[location]
            this.square.piece = this
            this.square.updateImg()
        }
    }
}

class Pawn extends Piece {
    constructor(square, team) {
        super(square, team);
        this.name = "pawn";
        this.pieceImg = this.setupImg()
    }

    canMove(location) {
        if (Math.abs(this.square.location - location) == 1 && location >= 0 && location <=15) {
            return true;
        } else {
            return false;
        }
    }

    setupImg() {
        let img = document.createElement("img");
        img.src = "./img/pieces/chess-pawn.png";
        img.classList.add("iconPiece");
        if (this.team == "black") {
            img.classList.add("blackPiece");
        } else {
            img.classList.add("whitePiece");
        }

        return img;
    }
}



let Game = new Board1D(BoardDiv);

Game.addPiece(1, "pawn")