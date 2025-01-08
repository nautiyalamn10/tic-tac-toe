import { Game } from '../models/game';

export class GameController {
    games: { [key: string]: Game } = {};

    createGame(roomId: string) {
        const game = new Game();
        this.games[roomId] = game;
    }

    makeMove(roomId: string, position: number, player: string) {
        const game = this.games[roomId];
        if (!game) return false;

        return game.makeMove(position, player);
    }

    getGameState(roomId: string) {
        const game = this.games[roomId];
        return game ? game.getBoard() : null;
    }

    getCurrentPlayer(roomId: string) {
        const game = this.games[roomId];
        return game ? game.getCurrentPlayer() : null;
    }

    getWinner(roomId: string) {
        const game = this.games[roomId];
        return game ? game.getWinner() : null;
    }
}
