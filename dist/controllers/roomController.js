"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const room_1 = require("../models/room");
const path = require('path');
class RoomController {
    constructor() {
        this.rooms = {};
    }
    createRoom(req, res) {
        console.log('in create room api');
        const { playerName } = req.body;
        const roomId = Math.random().toString(36).substr(2, 6);
        const room = new room_1.Room({ id: roomId, name: playerName }, roomId);
        this.rooms[roomId] = room;
        res.json({ roomId });
    }
    joinRoom(req, res) {
        const { roomId, playerName } = req.body;
        const room = this.rooms[roomId];
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        console.log('request in joinRoom : ', req.socket);
        const playerAdded = room.addPlayer({ id: '1', name: playerName });
        if (!playerAdded) {
            return res.status(400).json({ error: 'Room is full' });
        }
        res.json({ success: true, players: room.getPlayers() });
    }
    startGame(req, res) {
        const { roomId } = req.body;
        const room = this.rooms[roomId];
        if (room && room.startGame()) {
            res.json({ success: true });
        }
        else {
            res.status(400).json({ error: 'Room is not full yet' });
        }
    }
    getRoomById(req, res) {
        const { roomId } = req.params;
        if (this.rooms[roomId]) {
            res.sendFile('room.html', { root: 'client' });
        }
        else {
            res.status(404).send('Room not found');
        }
    }
}
exports.RoomController = RoomController;
