import { Fragment } from 'react';
import { useHistory } from 'react-router';
import FreezeWrapper from '../../components/FreezeWrapper/FreezeWrapper';
import Game from '../../components/Game/Game';
import GameController from '../../components/GameController/GameController';
import { ROUTES } from '../../constants/routes';

const OfflineGame = () => {
    const history = useHistory();
    return (
        <FreezeWrapper>
            <GameController
                render={({ game, handleRestart, handleExit, handlePlay }) => {
                    return (
                        <Fragment>
                            <Game isPlayer={true} game={game} handlePlay={handlePlay} />
                            <div className="my-6 text-center">
                                <button
                                    className={`${
                                        game.isCurrentCompleted ? 'text-green-500 cursor-pointer hover:underline' : 'text-gray-500 cursor-default'
                                    }`}
                                    disabled={!game.isCurrentCompleted}
                                    onClick={handleRestart}
                                >
                                    Play Again{' '}
                                </button>
                            </div>
                            <div className={`mt-6  text-center `}>
                                <button
                                    className={`${game.hasStart ? 'text-red-500 hover:underline cursor-pointer' : 'text-gray-500 cursor-default'}`}
                                    disabled={!game.hasStart}
                                    onClick={() => {
                                        handleExit();
                                        history.push(ROUTES.HOME);
                                    }}
                                >
                                    Quit
                                </button>
                            </div>
                        </Fragment>
                    );
                }}
            />
        </FreezeWrapper>
    );
};

export default OfflineGame;
