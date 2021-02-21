class ServerCommunication {
    constructor(board, serverID = null, team = "white", serverRoundText = null) {
        this.socket = io();
        this.board = board;
        this.team = team;

        this.serverRoundText = serverRoundText;

        this.clientID = this.socket.id;

        if(serverID != null) {
            this.joinServer(serverID, team);
        }

        if(this.board != null) {
            this.setupReceiveBoard();
            this.setupConfirmJoinServer();
        }
        
    }

    setupReceiveBoard() {
        this.socket.on("sendBoard", (req) => {
            if (req.serverID == this.serverID) {
                console.log(req);
                if(req.round%2 == 0) {
                    this.serverRoundText.textContent = "Turn: Black";
                } else {
                    this.serverRoundText.textContent = "Turn: White";
                }
                this.board.updateBoard(req.piece_array);
            } else {
                switch(req.error) {
                    case "Not in Server":
                        console.log(`[${req.playerID}] Failed to Request the Board because the player is not in Server [${req.serverID}]`);
                        break;
                }
            }
            
        });
    }

    setupConfirmJoinServer() {
        this.socket.on("joinedGame", (req) => {
            this.team = req.team;
            this.requestBoard(req.serverID);
            console.log(`[${req.playerID}] Successfully Joined Server [${req.serverID}]`)
        });
    }

    joinServer(serverID, team) {
        this.socket.emit("joinServer", {serverID: serverID, team: team});
        this.serverID = serverID;
    }

    createServer(serverID = this.generateID(6)) {
        this.socket.emit("createServer", {serverID: serverID});
        return serverID;
    }

    requestBoard(serverID) {
        this.socket.emit("requestBoard", {serverID: serverID})
    }

    requestMove(prev_location, to_move_location, serverID) {
        let move_package = this.board.boardSquares[prev_location].piece.requestMoveObject(to_move_location, serverID);
        this.socket.emit("requestMove", move_package);
    }

    generateID(length) {
        let ID = "";
        for (let i=0; i < length; i++) {
            ID += Math.floor(Math.random() * 10);
        }
        return ID;
    }
}