"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const game_1 = require("../models/game");
class GameController {
    constructor() {
        this.games = {};
    }
    createGame(roomId) {
        const game = new game_1.Game();
        this.games[roomId] = game;
    }
    makeMove(roomId, position, player) {
        const game = this.games[roomId];
        if (!game)
            return false;
        return game.makeMove(position, player);
    }
    getGameState(roomId) {
        const game = this.games[roomId];
        return game ? game.getBoard() : null;
    }
    getCurrentPlayer(roomId) {
        const game = this.games[roomId];
        return game ? game.getCurrentPlayer() : null;
    }
    getWinner(roomId) {
        const game = this.games[roomId];
        return game ? game.getWinner() : null;
    }
}
exports.GameController = GameController;
