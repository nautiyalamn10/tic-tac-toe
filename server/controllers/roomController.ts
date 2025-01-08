import { Request, Response } from 'express';
import { Room } from '../models/room';
const path = require('path');

export class RoomController {
    rooms: { [key: string]: Room } = {};

    createRoom(req: Request, res: Response) {
        console.log('in create room api')
        const { playerName } = req.body;
        const roomId = Math.random().toString(36).substr(2, 6);
        const room = new Room({ id: roomId, name: playerName }, roomId);
        this.rooms[roomId] = room;
        res.json({ roomId });
    }

    joinRoom(req: Request, res: Response) {
        const { roomId, playerName } = req.body;
        const room = this.rooms[roomId];

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        console.log('request in joinRoom : ',req.socket)
        const playerAdded = room.addPlayer({ id: '1', name: playerName });
        if (!playerAdded) {
            return res.status(400).json({ error: 'Room is full' });
        }

        res.json({ success: true, players: room.getPlayers() });
    }

    startGame(req: Request, res: Response) {
        const { roomId } = req.body;
        const room = this.rooms[roomId];

        if (room && room.startGame()) {
            res.json({ success: true });
        } else {
            res.status(400).json({ error: 'Room is not full yet' });
        }
    }

    getRoomPlayers(req: Request, res: Response) {
        const { roomId } = req.params;
        if (this.rooms[roomId]) {
            res.send(this.rooms[roomId].getPlayers())
        } else {
            res.status(404).send('Room not found');
        }
    }
}
