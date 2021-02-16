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
            let prevLocation = this.square.location;
            this.square.piece = null;
            this.square.updateImg();
            this.square = this.square.board.boardSquares[location];

            // This call for the check function shouldnt be here, should be on the CanMove function, but it's the only way I found to do it
            // if you come across this and know a better way to do it, it would be great.

            // It isn't in the CanMove function because that would cause that same function to loop infinitely, since checkForCheck uses the CanMove Function, and the CanMove function would use checkForCheck

            // Here we interrupt the move process to check for a Check on one of the kings, if a Check is found, we then undo the transfer process
            // to revert the position of the piece to it's previous positon.
            if (this.square.board.checkForCheck()) {
                this.square = this.square.board.boardSquares[prevLocation];
            }
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
        this.name = "bishop";
        this.pieceImg = this.setupImg();
    }

    canMove(location) {
        if (this.square.board.boardSquares[location].piece != null ) {
            if (this.square.board.boardSquares[location].piece.team == this.team) return false;
        }

        if (this.square.isWhite() != this.square.board.boardSquares[location].isWhite() || Math.abs(this.square.location - location) > 4) return false;

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

class Knight extends Piece {
    constructor(square, team) {
        super(square, team);
        this.name = "knight";
        this.pieceImg = this.setupImg()
    }

    canMove(location) {
        if (this.square.board.boardSquares[location].piece != null ) {
            if (this.square.board.boardSquares[location].piece.team == this.team) return false;
        }
        if ((Math.abs(this.square.location - location) == 2 || Math.abs(this.square.location - location) == 3) && location >= 0 && location <=15) {
            return true;
        } else {
            return false;
        }
    }

    setupImg() {
        let img = document.createElement("img");
        img.src = "./img/pieces/chess-knight.png";
        img.classList.add("iconPiece");
        if (this.team == "black") {
            img.classList.add("blackPiece");
        } else {
            img.classList.add("whitePiece");
        }

        return img;
    }
}

class Queen extends Piece {
    constructor(square, team) {
        super(square, team);
        this.name = "queen";
        this.pieceImg = this.setupImg();
    }

    canMove(location) {
        if (this.square.board.boardSquares[location].piece != null ) {
            if (this.square.board.boardSquares[location].piece.team == this.team) return false;
        }
        if (this.square.isWhite() != this.square.board.boardSquares[location].isWhite() || Math.abs(this.square.location - location) > 4) return false;
        
        if (this.square.isWhite() == this.square.board.boardSquares[location].isWhite()) {
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
        img.src = "./img/pieces/chess-queen.png";
        img.classList.add("iconPiece");
        if (this.team == "black") {
            img.classList.add("blackPiece");
        } else {
            img.classList.add("whitePiece");
        }

        return img;
    }
}

class King extends Piece {
    constructor(square, team) {
        super(square, team);
        this.name = "king";
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
        img.src = "./img/pieces/chess-king.png";
        img.classList.add("iconPiece");
        if (this.team == "black") {
            img.classList.add("blackPiece");
        } else {
            img.classList.add("whitePiece");
        }

        return img;
    }
}