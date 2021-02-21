const express = require("express");
const board = require("./server_board")
const fs = require("fs");
const path = require("path")
const PORT = process.env.PORT || 3000;

const app = express();

const server = require("http").createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname + '/public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/public/main_menu/index.html'));
})

app.get("/room/:team/:room", (req, res) => {
    let serverID = req.params.room;
    let team = req.params.team;

    if(isNaN(serverID)) {
        res.status(400);
        res.send("Room must be Number")
    } else if(Game.serverList[serverID] == undefined){
        res.status(404);
        res.send("Room Not Found");
    } else {
        res.sendFile(path.join(__dirname + '/public/ingame/index.html'));
    }
})

class GameServers  {
    constructor(socket) {
        console.log("\nServer Started \n")
        this.socket = socket;
        this.serverList = {};
        this.playerList = {};

        io.on("connection", socket => {
            console.log(`[${socket.id}] Connected`)
            this.setupRequestBoard(socket);
            this.setupJoinServer(socket);
            this.setupRequestMove(socket);
            this.setupCreateServer(socket);
        })
        
    }

// Server Functions

    createServer(ID = this.generateID(6)) {
        let Server = {};
        Server.board = new board.Board1D();
        Server.connectedPlayers = [];
        Server.serverID = ID;

        Server.whiteTeam = null;
        Server.blackTeam = null;

        Server.round = 1;

        Server.addPiece = function (location, piece_name, team) {
            Server.board.addPiece(location, piece_name, team);
            console.log(`[${"Server"}] Added ${piece_name} to the position ${location} on team ${team}`);
        }
        Server.makeMove = function (prev_location, to_move_location, team, playerID = "Player") {
            let pieceTeam = Server.board.boardSquares[prev_location].piece.team

            if((Server.round % 2 != 0 && pieceTeam == "black") || (Server.round % 2 == 0 && pieceTeam == "white")) {
                console.log(`[${playerID}] Tried to Move ${Server.board.boardSquares[prev_location].piece.name} from ${prev_location} to ${to_move_location} but it's not his turn [${Server.serverID}]`);
                return;
            }

            if(team == pieceTeam && Server.board.boardSquares[prev_location].piece != null && Server.board.boardSquares[to_move_location]) {
                let tryMove = Server.board.boardSquares[prev_location].piece.move(to_move_location);
                if(tryMove == "check"){
                    console.log(`[${playerID}] Tried to Move ${Server.board.boardSquares[prev_location].piece.name} from ${prev_location} to ${to_move_location} but he's on check [${Server.serverID}]`);
                }else if(tryMove == "illegal"){
                    console.log(`[${playerID}] Tried to Move ${Server.board.boardSquares[prev_location].piece.name} from ${prev_location} to ${to_move_location} but the move is illegal [${Server.serverID}]`);
                } else {
                    Server.round  += 1;
                    console.log(`[${playerID}] Moved ${Server.board.boardSquares[to_move_location].piece.name} from ${prev_location} to ${to_move_location}, he's on the ${team} team [${Server.serverID}]`);
                };
            } else {
                console.log(`[${playerID}] Tried to Move ${Server.board.boardSquares[prev_location].piece.name} from ${prev_location} to ${to_move_location} but he's on the ${team} team while the piece is on the ${pieceTeam} team [${Server.serverID}]`);
            }
        }
        this.serverList[ID] = Server;

        Server.addPiece(0, "king", "white");
        
        Server.addPiece(2, "rook", "white");
        Server.addPiece(3, "bishop", "white");
        Server.addPiece(4, "knight", "white");
        Server.addPiece(5, "pawn", "white");

        Server.addPiece(10, "pawn", "black");
        Server.addPiece(11, "knight", "black");
        Server.addPiece(12, "bishop", "black");
        Server.addPiece(13, "rook", "black");

        Server.addPiece(15, "king", "black");

        console.log(`[${"User"}] Server Created [${Server.serverID}]`);
    }

    getServer(ID) {
        return this.serverList[ID];
    }

    getServerList() {
        return this.serverList;
    }

    setupCreateServer(socket){
        socket.on("createServer", (req) => {
            let serverID = req.serverID;
            this.createServer(serverID);
        })
    }

    setupJoinServer(socket){
        console.log(`[${socket.id}] Setted up JoinServer socket`);
        socket.on("joinServer", (req) => {
            let playerID = socket.id;
            let serverID = req.serverID;
            let team = req.team;
            if(team == "white" && this.serverList[serverID].whiteTeam != null && this.serverList[serverID].blackTeam == null) {
                team = "black";
            } else if(team == "black" && this.serverList[serverID].blackTeam != null && this.serverList[serverID].whiteTeam == null) {
                team = "white";
            } else if(this.serverList[serverID].blackTeam != null && this.serverList[serverID].whiteTeam != null){
                team = "spectator";
            }

            this.joinPlayerToServer(playerID, serverID, team, socket);

            console.log(`[${playerID}] Joined Server [${serverID}]`)
            this.socket.emit("joinedGame", {confirmation : true, serverID: serverID, playerID: playerID, team:team});
        })
    }

    setupRequestBoard(socket) {
        console.log(`[${socket.id}] Setted up RequestBoard socket`);
        socket.on("requestBoard", (req) => {
            let playerID = socket.id;
            let serverID = req.serverID;
            if(this.serverList[serverID].connectedPlayers.includes(playerID)) {

                let board = this.serverList[serverID].board.getPieces()
                console.log(`[${playerID}] Requested Board from Server [${serverID}]`)
                this.socket.emit("sendBoard", {error: "None", piece_array: board, serverID: serverID, playerID: playerID});

            } else {

                console.log(`[${playerID}] Tried to Request Board from Server But it's not Connected [${serverID}]`)
                this.socket.emit("sendBoard", {error: "Not in Server", serverID: serverID, playerID: playerID});

            }

            
        })
    }

    setupRequestMove(socket) {
        console.log(`[${socket.id}] Setted up RequestMove socket`);
        socket.on("requestMove", (req) => {
            let playerID = socket.id;
            let serverID = req.serverID;
            let to_move_location = req.move_Location;
            let prev_location = req.prev_location;

            if(this.getServer(serverID).connectedPlayers.includes(playerID)) {
                if(this.getServer(serverID).whiteTeam == playerID) {
                    let team = "white"
                    this.getServer(serverID).makeMove(prev_location, to_move_location, team, playerID);
                    this.sendBoardToPlayers(serverID);
                } else if (this.getServer(serverID).blackTeam == playerID) {
                    let team = "black"
                    this.getServer(serverID).makeMove(prev_location, to_move_location, team, playerID)
                    this.sendBoardToPlayers(serverID);
                } else {
                    console.log(`[${playerID}] Player is not someone who is able to move pieces on this Server [${serverID}]`)
                }

            } else {

                console.log(`[${playerID}] Tried to Move a Piece on Server but the User is not Connected [${serverID}]`)
                this.socket.emit("sendBoard", {error: "Not in Server", serverID: serverID, playerID: playerID});

            }
        })
    }

    sendBoardToPlayers(serverID) {
        let board = this.serverList[serverID].board.getPieces()
        console.log(`[${"All Players"}] Sent board to every player on the room [${serverID}]`);
        this.socket.in(this.formatRoomID(serverID)).emit("sendBoard", {error: "None", piece_array: board, serverID: serverID, playerID: "All Players"});
    }

    joinPlayerToServer(playerID, serverID, playerTeam, socket) {
        this.playerList.playerID = this.serverList[serverID];
        if(playerTeam == "white") {
            this.getServer(serverID).whiteTeam = playerID;
        } else if(playerTeam == "black") {
            this.getServer(serverID).blackTeam = playerID;
        }
        
        socket.join(this.formatRoomID(serverID));
        this.serverList[serverID].connectedPlayers.push(playerID);
    }

    formatRoomID(serverID) {
        return "room-" + serverID;
    }

    generateID(length) {
        let ID = "";
        for (let i=0; i < length; i++) {
            ID += Math.floor(Math.random() * 10);
        }
        return ID;
    }
}

let Game = new GameServers(io);



server.listen(PORT);