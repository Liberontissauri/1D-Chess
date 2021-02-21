class Square{
    constructor(board ,location, piece = null) {
        this.board = board;
        this.piece = piece;

        this.location = location;
        
    }

    isWhite() {
        return this.location%2 != 0;
    }

    cleanSquare() {
        if(this.piece != null) {
            this.piece.square = null;
            this.piece = null;
        }
    }


}

module.exports.Square = Square