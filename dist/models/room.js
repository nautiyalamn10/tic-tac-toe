"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
class Room {
    constructor(creator, id) {
        this.players = [];
        this.gameStarted = false;
        this.creator = creator;
        this.id = id;
    }
    addPlayer(player) {
        if (this.players.length < 2) {
            this.players.push(player);
            return true;
        }
        return false;
    }
    startGame() {
        if (this.players.length === 2) {
            this.gameStarted = true;
            return true;
        }
        return false;
    }
    getPlayers() {
        return this.players;
    }
    isFull() {
        return this.players.length === 2;
    }
}
exports.Room = Room;
