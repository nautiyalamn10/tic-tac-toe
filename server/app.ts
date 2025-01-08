import express, { Request, Response } from 'express';
import http from 'http';
import { Server } from "socket.io";
import path from 'path';

// Initialize express and create HTTP server
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);


import { RoomController } from './controllers/roomController';
import { GameController } from './controllers/gameController';
import { Player } from './models/room';
app.use(express.json());

const roomController = new RoomController();
const gameController = new GameController();

// Define the types for rooms
// interface Room {
//   users: string[];
// }

// let rooms: { [key: string]: Room } = {}; // Store rooms in memory

// Middleware to serve static files (client-side resources)
app.use(express.static(path.join(__dirname, '../client')));


// Routes
app.post('/create-room', (req, res) => roomController.createRoom(req, res));
// app.post('/join-room', (req, res) => roomController.joinRoom(req, res));
// app.post('/join-room', (req, res) => roomController.joinRoom(req, res));

app.post('/start-game', (req, res) => roomController.startGame(req, res));
app.get('/room/:roomId', (req: Request, res: Response) => roomController.getRoomPlayers(req,res));

// WebSocket connection handling
io.on('connection', (socket) => {
  socket.on('join-room', (roomId: string, playerName: string) => {
    const room = roomController.rooms[roomId];
    if (room && room.isFull()) {
      gameController.createGame(roomId);
      socket.emit('game-started', gameController.getGameState(roomId));
    }
    else if(room){
      const playerAdded = room.addPlayer({ id: socket.id, name: playerName });
      if (!playerAdded) {
      }
      else{
        socket.join(roomId);
        io.to(roomId).emit('user-joined', playerName, roomController.rooms[roomId].players);
      }
    }
  });

  socket.on('make-move', (roomId: string, position: number, player: string) => {
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
