const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store rooms and their members (in-memory for simplicity)
let rooms = {};

// Middleware to serve static files
app.use(express.static('client'));

// Function to generate a random room ID (for simplicity)
function generateRoomId() {
  return Math.random().toString(36).substr(2, 6);
}

// Create a room (POST request to create a room)
app.post('/create-room', (req, res) => {
  const roomId = generateRoomId();
  rooms[roomId] = { users: [] };  // Initialize the room with an empty user list
  res.json({ roomId });
});

// Room page (GET request to access a room)
app.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  if (rooms[roomId]) {
    res.sendFile(path.join(__dirname, '../client', 'room.html'));
  } else {
    res.status(404).send('Room not found');
  }
});

// status api
app.get('/status', (req, res) => {
    res.send('flying high').status(200);
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('a user connected');
  
  let currentRoom = null;
  let userName = '';

  // Listen for a user joining a room
  socket.on('join-room', (roomId, name) => {
    if (rooms[roomId]) {
      currentRoom = roomId;
      userName = name;
      rooms[roomId].users.push(userName);
      socket.join(roomId);
      io.to(roomId).emit('user-joined', userName, rooms[roomId].users);
    }
  });

  // Listen for a new message in the room
  socket.on('chat-message', (message) => {
    if (currentRoom) {
      io.to(currentRoom).emit('chat-message', { user: userName, message });
    }
  });

  // Listen for user disconnect (clean up)
  socket.on('disconnect', () => {
    if (currentRoom) {
      rooms[currentRoom].users = rooms[currentRoom].users.filter(user => user !== userName);
      io.to(currentRoom).emit('user-left', userName, rooms[currentRoom].users);
    }
    console.log('a user disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
