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

    cleanBoard() {
        this.boardSquares.forEach(square => {
            square.cleanSquare();
        });
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

    checkForCheck(moveTeam) {
        for (let i=0; i < this.boardSquares.length; i++) {
            if(this.boardSquares[i].piece != null) {
                
                if (this.boardSquares[i].piece.team == "white" && moveTeam != this.boardSquares[i].piece.team && this.boardSquares[i].piece.canMove(this.blackKing.square.location)) return true;
                if (this.boardSquares[i].piece.team == "black" && moveTeam != this.boardSquares[i].piece.team && this.boardSquares[i].piece.canMove(this.whiteKing.square.location)) return true;
            }
        }
    }

    updateBoard(piece_array) {
        this.cleanBoard();
        this.boardSquares.forEach(square => {
            if (piece_array[square.location] != null) {
                this.addPiece(square.location, piece_array[square.location].name, piece_array[square.location].team)
            }
        });
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

        if(this.piece != null)  {
            if(this.squareDiv.firstChild != undefined) this.squareDiv.removeChild(this.squareDiv.firstChild);
            this.squareDiv.appendChild(this.piece.pieceImg)
        }
        
    }

    cleanSquare() {
        if(this.piece != null) {
            this.piece.square = null;
            this.piece = null;
            this.updateImg();
        }
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
            if(square.board.boardSquares[square.board.getSelected().location].piece != null) {
                Communication.requestMove(square.board.getSelected().location, square.location, Communication.serverID);
            }
            square.board.cleanSelected();
            return;
        };
        square.board.selectedSquaresNumber += 1;
        square.squareDiv.classList.remove("darkSquare");
        square.squareDiv.classList.remove("lightSquare");
        square.squareDiv.classList.add("selectedSquare");
        return true;
    }
}

// class ServerCommunication {
//     constructor(board) {
//         this.socket = io();
//         this.board = board;

//         this.clientID = this.socket.id;

//         this.setupReceiveBoard();
//         this.setupConfirmJoinServer();
//     }

//     setupReceiveBoard() {
//         this.socket.on("sendBoard", (req) => {
//             if (req.error == "None") {
//                 this.board.updateBoard(req.piece_array);
//             } else {
//                 switch(req.error) {
//                     case "Not in Server":
//                         console.log(`[${req.playerID}] Failed to Request the Board because the player is not in Server [${req.serverID}]`);
//                         break;
//                 }
//             }
            
//         });
//     }

//     setupConfirmJoinServer() {
//         this.socket.on("joinedGame", (req) => {
//             console.log(`[${req.playerID}] Successfully Joined Server [${req.serverID}]`)
//         });
//     }

//     joinServer(serverID, team) {
//         this.socket.emit("joinServer", {serverID: serverID, team: team});
//         this.serverID = serverID;
//     }

//     requestBoard(serverID) {
//         this.socket.emit("requestBoard", {serverID: serverID})
//     }

//     requestMove(prev_location, to_move_location, serverID) {
//         let move_package = this.board.boardSquares[prev_location].piece.requestMoveObject(to_move_location, serverID);
//         this.socket.emit("requestMove", move_package);
//     }

//     generateID(length) {
//         let ID = "";
//         for (let i=0; i < length; i++) {
//             ID += Math.floor(Math.random() * 10);
//         }
//         return ID;
//     }
// }

const teamLabel = document.querySelector("#teamLabel");
const serverIdText = document.querySelector("#serverIdText");
const serverRoundText = document.querySelector("#serverRoundText");

let pathname = window.location.pathname;

let team = "white";

if(pathname.includes("black")) {
    team = "black";
}

pathname = pathname.slice(-6);

serverIdText.textContent = "Server ID: " + pathname;

let Game = new Board1D(BoardDiv);

let Communication = new ServerCommunication(Game, pathname, team, serverRoundText);

// We use a timeout because the team response takes some time to reach the client
setTimeout(() => {
    if(Communication.team == "white") {
        teamLabel.textContent = "White Team";
    } else if (Communication.team == "black"){
        teamLabel.textContent = "Black Team";
    } else {
        teamLabel.textContent = "Spectator Team"
    }
    Communication.requestBoard(pathname);
}, 100);

