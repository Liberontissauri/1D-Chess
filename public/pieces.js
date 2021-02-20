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
            let prev_location = this.square.location;
            let board = this.square.board
            this.square.piece = null;
            this.square = null;

            // This is a horrible solution, but we basically temporarily move the piece to it's next position, check if there is a check,
            // If there is one, we move the piece to its previous position and proceed, if there isn't a check, we update the images to 
            // Display the moved pieces, and make the temporary movement permanent.

            board.boardSquares[location].piece = this;
            this.square = board.boardSquares[location];

            if(board.checkForCheck(this.team)){
                this.square.piece = null;
                this.square = null;

                board.boardSquares[prev_location].piece = this;
                this.square = board.boardSquares[prev_location];
            } else {
                board.boardSquares[location].updateImg()
                board.boardSquares[prev_location].updateImg()
            }
        }
    }

    requestMoveObject(location, serverID) {
        let move_package = {};
        move_package.move_Location = location;
        move_package.prev_location = this.square.location;
        move_package.serverID = serverID;

        return move_package;
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