import React from 'react';

const SCOREBOARD_TITLES = {
    X: 'Player (X)',
    Tie: 'Tie',
    O: 'Player (O)',
};

const ScoreBoard = ({ scoreCard }) => {
    return (
        <div className="flex justify-between p-4 text-xs">
            {Object.entries(SCOREBOARD_TITLES).map((card) => (
                <div key={card[1]} className="flex flex-col items-center">
                    <div className="">{card[1]}</div>
                    <div className="p-2 text-yellow-500 border mt-2">{scoreCard[card[0]]}</div>
                </div>
            ))}
        </div>
    );
};

export default ScoreBoard;
