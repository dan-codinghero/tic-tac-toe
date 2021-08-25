import React from 'react';

const Board = ({ tiles = [], handleGamePlay, disablePlayerMove = false }) => {
    return (
        <div className="grid grid-cols-3 grid-rows-3 w-44 h-44 mx-auto">
            {tiles.map((tile, index) => (
                <div
                    key={index}
                    className={`${
                        disablePlayerMove ? 'pointer-events-none' : 'pointer-events-auto'
                    } border flex justify-center items-center text-3xl cursor-pointer`}
                    onClick={() => handleGamePlay(index)}
                >
                    {tile}
                </div>
            ))}
        </div>
    );
};

export default Board;
