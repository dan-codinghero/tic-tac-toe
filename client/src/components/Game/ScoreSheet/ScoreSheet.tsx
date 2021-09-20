import { FC } from 'react';
import { Players, ScoreCard } from '../../../types/game';

const ScoreSheet: FC<{ scoreCard: ScoreCard; player: Players; currentPlayer?: Players }> = ({ scoreCard, player, currentPlayer }) => {
    const renderScoreSheet = (): JSX.Element[] => {
        return Object.entries(scoreCard).map((sheet) => {
            const isPlayerCard = sheet[0] === player;
            return (
                <div
                    className={`flex items-center mx-2 border ${isPlayerCard ? 'border-b-2' : ''}  rounded-md py-1 px-2 cursor-pointer`}
                    style={{ ...(isPlayerCard ? { borderBottomColor: 'green' } : {}) }}
                    key={sheet[0]}
                >
                    {currentPlayer && sheet[0] === player && (
                        <span className={`inline-block mx-2 rounded ${currentPlayer === player ? 'bg-green-500' : 'bg-red-500'}  h-2 w-2 `}></span>
                    )}{' '}
                    Player {sheet[0]} - {sheet[1]}
                </div>
            );
        });
    };

    return <div className="flex justify-center m-4">{renderScoreSheet()}</div>;
};

export default ScoreSheet;
