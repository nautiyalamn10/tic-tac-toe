"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
// Initialize express and create HTTP server
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer);
const roomController_1 = require("./controllers/roomController");
const gameController_1 = require("./controllers/gameController");
app.use(express_1.default.json());
const roomController = new roomController_1.RoomController();
const gameController = new gameController_1.GameController();
// Define the types for rooms
// interface Room {
//   users: string[];
// }
// let rooms: { [key: string]: Room } = {}; // Store rooms in memory
// Middleware to serve static files (client-side resources)
app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
// Routes
app.post('/create-room', (req, res) => roomController.createRoom(req, res));
// app.post('/join-room', (req, res) => roomController.joinRoom(req, res));
// app.post('/join-room', (req, res) => roomController.joinRoom(req, res));
app.post('/start-game', (req, res) => roomController.startGame(req, res));
app.get('/room/:roomId', (req, res) => roomController.getRoomById(req, res));
// WebSocket connection handling
io.on('connection', (socket) => {
    socket.on('join-room', (roomId, playerName) => {
        const room = roomController.rooms[roomId];
        if (room && room.isFull()) {
            gameController.createGame(roomId);
            socket.emit('game-started', gameController.getGameState(roomId));
        }
        else if (room) {
            const playerAdded = room.addPlayer({ id: socket.id, name: playerName });
            if (!playerAdded) {
            }
            else {
                socket.join(roomId);
                io.to(roomId).emit('user-joined', playerName, roomController.rooms[roomId].players);
            }
        }
    });
    socket.on('make-move', (roomId, position, player) => {
        const success = gameController.makeMove(roomId, position, player);
        if (success) {
            io.to(roomId).emit('move-made', gameController.getGameState(roomId));
        }
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// Start the server
httpServer.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
