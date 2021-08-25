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

export const placeMark = (tileIdx, tiles, symbol) => {
    if (tiles[tileIdx] !== '') {
        return;
    }
    return tiles.map((tile, index) => {
        if (index === tileIdx) {
            return symbol;
        }

        return tile;
    });
};

export const checkWin = (tiles) => {
    return WINNING_COMBINATIONS.some((combination) => {
        const first = combination[0];
        return combination.every((index) => {
            return tiles[index] && tiles[first] === tiles[index];
        });
    });
};

export const isDraw = (tiles) => {
    return tiles.every((tile) => tile !== '');
};

export const calculateScores = (isDraw = false, scoreCard, player) => {
    const key = isDraw ? 'Tie' : player;
    const updatedScoreCard = { ...scoreCard, [key]: scoreCard[key] + 1 };
    window.localStorage.setItem('scoreCard', JSON.stringify(updatedScoreCard));
    return updatedScoreCard;
};
