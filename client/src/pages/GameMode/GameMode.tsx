import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import shortUUID from 'short-uuid';
import { ROUTES } from '../../constants/routes';
import { GameModeTypes } from '../../types/game';

const GameMode: FC = () => {
    const history = useHistory();

    const handleGameModeSelection = async (mode: GameModeTypes) => {
        if (mode === GameModeTypes.OFFLINE_FRIEND) {
            history.push(ROUTES.GAME, { from: history.location.pathname, isOffline: true, host: true });
        }
        if (mode === GameModeTypes.ONLINE_FRIEND) {
            const room = shortUUID().generate();

            history.push(`${ROUTES.GAME}/${room}`, { from: history.location.pathname, isOffline: false, host: true, room });
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="my-4 rounded-md border p-2 cursor-pointer" onClick={() => handleGameModeSelection(GameModeTypes.OFFLINE_FRIEND)}>
                Play 2P
            </div>
            <div className="my-4 rounded-md border p-2 cursor-pointer" onClick={() => handleGameModeSelection(GameModeTypes.ONLINE_FRIEND)}>
                Play with a friend
            </div>
        </div>
    );
};

export default GameMode;
