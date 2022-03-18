interface CustomGameState {
    phase: number;
    board: number;
    distribution: Card[];
}

interface Card {
    id: number;
    title: string;
    health: number;
    mana: number;
    description: string;
}