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
            if (this.square.board.boardSquares[location].piece != null) {
                this.square.board.boardSquares[location].squareDiv.removeChild(this.square.board.boardSquares[location].piece.pieceImg);
            }
            this.square.piece = this
            this.square.updateImg()
        }
    }

    updateTeamColour (img){
        if (this.team = "white") {
            classList.remove("blackPiece");
            classList.add("whitePiece");
        } else {
            classList.remove("whitePiece");
            classList.add("blackPiece");
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
        if (this.square.board.boardSquares[location].piece != null ) {
            if (this.square.board.boardSquares[location].piece.team == this.team) return false;
        }

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

class Rook extends Piece {
    constructor(square, team) {
        super(square, team);
        this.name = "rook";
        this.pieceImg = this.setupImg();
    }

    canMove(location) {
        if (this.square.board.boardSquares[location].piece != null ) {
            if (this.square.board.boardSquares[location].piece.team == this.team) return false;
        }

        if (this.square.location < location) {
            
            for (let i = this.square.location + 1 ; i < location; i++) {
                if (this.square.board.boardSquares[i].piece != null) {

                    return false;
                }
            }
            return true;

        } else if (this.square.location > location) {

            for (let i = this.square.location - 1 ; i > location; i--) {
                if (this.square.board.boardSquares[i].piece != null) {
                    
                    return false;
                }
            }
            return true;

        } else {
            return false;
        }
    }

    setupImg() {
        let img = document.createElement("img");
        img.src = "./img/pieces/chess-rook.png";
        img.classList.add("iconPiece");
        if (this.team == "black") {
            img.classList.add("blackPiece");
        } else {
            img.classList.add("whitePiece");
        }

        return img;
    }
}

class Bishop extends Piece {
    constructor(square, team) {
        super(square, team);
        this.name = "rook";
        this.pieceImg = this.setupImg();
    }

    canMove(location) {
        if (this.square.board.boardSquares[location].piece != null ) {
            if (this.square.board.boardSquares[location].piece.team == this.team) return false;
        }

        if (this.square.isWhite() != this.square.board.boardSquares[location].isWhite()) return false;

        if (this.square.location < location) {
            
            for (let i = this.square.location + 1 ; i < location; i++) {
                if (this.square.board.boardSquares[i].piece != null && this.square.isWhite() == this.square.board.boardSquares[i].isWhite()) {

                    return false;
                }
            }
            return true;

        } else if (this.square.location > location) {

            for (let i = this.square.location - 1 ; i > location; i--) {
                if (this.square.board.boardSquares[i].piece != null && this.square.isWhite() == this.square.board.boardSquares[i].isWhite()) {
                    
                    return false;
                }
            }
            return true;

        } else {
            return false;
        }
    }

    setupImg() {
        let img = document.createElement("img");
        img.src = "./img/pieces/chess-bishop.png";
        img.classList.add("iconPiece");
        if (this.team == "black") {
            img.classList.add("blackPiece");
        } else {
            img.classList.add("whitePiece");
        }

        return img;
    }
}