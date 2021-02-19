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
        })
        
    }

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

    joinPlayer(player_ID, server_ID) {
        this.playerList.player_ID = this.serverList[server_ID];
        this.serverList.server_ID.connectedPlayers.push(player_ID);
    }

    setupRequestBoard(socket) {
        console.log(`[${socket.id}] Setted up RequestBoard socket`);
        socket.on("requestBoard", (req) => {
            let playerID = socket.id;
            let serverID = req.serverID;
            let board = this.serverList[serverID].board.getPieces()

            console.log(`[${playerID}] Requested Board from Server [${serverID}]`)
            this.socket.emit("sendBoard", board);
        })
    }

    generateID(length) {
        let ID = "";
        for (let i=0; i < length; i++) {
            ID += Math.floor(Math.random() * 10);
        }
        return ID;
    }

    getServerList() {
        return this.serverList;
    }
}

let Game = new GameServers(io);

Game.createServer("123456");

Game.getServer("123456").board.addPiece(0,"rook", "white");



server.listen(PORT);