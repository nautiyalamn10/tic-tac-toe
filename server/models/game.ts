export type Board = (string | null)[];

export class Game {
    board: Board;
    currentPlayer: string;
    winner: string | null;
    turnCount: number;

    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.winner = null;
        this.turnCount = 0;
    }

    makeMove(position: number, player: string): boolean {
        if (this.board[position] === null && player === this.currentPlayer) {
            this.board[position] = player;
            this.turnCount += 1;
            this.checkWinner();
            this.switchPlayer();
            return true;
        }
        return false;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
            [0, 4, 8], [2, 4, 6]               // diagonals
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.winner = this.board[a];
                return;
            }
        }

        if (this.turnCount === 9) {
            this.winner = 'Draw';
        }
    }

    getBoard() {
        return this.board;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    getWinner() {
        return this.winner;
    }
}
