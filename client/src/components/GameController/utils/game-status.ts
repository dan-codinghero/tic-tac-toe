import { Players } from '../../../types/game';

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export const checkGameStatus = (
    squares: Players[]
): {
    hasEnd: boolean;
    winner: Players | null;
} => {
    let winner!: Players;
    const isWin = WINNING_COMBINATIONS.some((combination) => {
        const firstPosition = combination[0];
        return combination.every((position) => {
            winner = squares[position];
            return squares[position] && squares[firstPosition] === squares[position];
        });
    });
    const isDraw = squares.every((square) => (square && square.length ? true : false));

    return { hasEnd: isDraw || isWin, winner: isWin ? winner : null };
};
