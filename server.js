let express = require("express");
let board = require("./server_board")
let fs = require("fs");
const serveStatic = require("serve-static");
const PORT = process.env.PORT || 3000;

const app = express();

const server = require("http").createServer(app);
const io = require('socket.io')(server);

app.use(express.static("./public"));

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
        })
        
    }

// Server Functions

    createServer(ID = this.generateID(6)) {
        let Server = {};
        Server.board = new board.Board1D();
        Server.connectedPlayers = [];
        Server.serverID = ID;
        this.serverList[ID] = Server;
    }

    getServer(ID) {
        return this.serverList[ID];
    }

    getServerList() {
        return this.serverList;
    }

    setupJoinServer(socket){
        console.log(`[${socket.id}] Setted up JoinServer socket`);
        socket.on("joinServer", (req) => {
            let playerID = socket.id;
            let serverID = req.serverID;

            this.joinPlayerToServer(playerID, serverID);

            console.log(`[${playerID}] Joined Server [${serverID}]`)
            this.socket.emit("joinedGame", {confirmation : true, serverID: serverID, playerID: playerID});
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

    joinPlayerToServer(player_ID, server_ID) {
        this.playerList.player_ID = this.serverList[server_ID];
        this.serverList[server_ID].connectedPlayers.push(player_ID);
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

Game.createServer("123456");

Game.getServer("123456").board.addPiece(0,"rook", "white");



server.listen(PORT);