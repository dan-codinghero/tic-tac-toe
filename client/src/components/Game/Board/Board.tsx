import { FC } from 'react';
import { Players } from '../../../types/game';

type BoardProps = {
    squares: Players[];
    handleGamePlay: (n: number) => void;
    disable?: boolean;
};

const Board: FC<BoardProps> = ({ squares, handleGamePlay, disable }) => {
    return (
        <div className="grid grid-cols-3 grid-rows-3 w-44 h-44 mx-auto">
            {squares.map((square, index) => (
                <div
                    key={index}
                    className={`${
                        disable || square ? 'pointer-events-none' : 'pointer-events-auto hover:bg-white hover:bg-opacity-50'
                    } border flex justify-center items-center text-3xl cursor-pointer`}
                    onClick={disable || square ? () => {} : () => handleGamePlay(index)}
                >
                    {square}
                </div>
            ))}
        </div>
    );
};

export default Board;
