export interface Player {
    id: string;
    name: string;
}

export class Room {
    id: string;
    creator: Player;
    players: Player[] = [];
    gameStarted: boolean = false;

    constructor(creator: Player, id: string) {
        this.creator = creator;
        this.id = id;
    }

    addPlayer(player: Player): boolean {
        if (this.players.length < 2) {
            this.players.push(player);
            return true;
        }
        return false;
    }

    startGame(): boolean {
        if (this.players.length === 2) {
            this.gameStarted = true;
            return true;
        }
        return false;
    }

    getPlayers(): Player[] {
        return this.players;
    }

    isFull(): boolean {
        return this.players.length === 2;
    }
}
