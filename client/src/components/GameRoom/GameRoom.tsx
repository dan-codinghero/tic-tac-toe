import { FC, Fragment, useEffect, useRef } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import { AiFillEye, AiOutlineClose, AiOutlineCopy } from 'react-icons/ai';
import { ROUTES } from '../../constants/routes';

import { GameRoomHistoryState, GameRoomMember, GameRoomStatus } from '../../types/game-room';
import useGameRoom from './hooks/useGameRoom';
import Timer from '../Timer/Timer';
import { GameStatus, PlayAgainStatus } from '../../types/game';
import GameController from '../GameController/GameController';
import Game from '../Game/Game';

const GameRoom: FC = () => {
    const { roomId } = useParams<{ roomId: string }>();

    const location = useLocation<GameRoomHistoryState>();
    const history = useHistory();
    const copyRoomRef = useRef<HTMLSpanElement>(null);
    const handlePushUpdateRef = useRef<() => void>();

    const isHost = location?.state?.host || false;
    const room = location?.state?.room || roomId;

    const { gameRoom, handleRoomExit } = useGameRoom(isHost, room);

    const roomHasSpectator = gameRoom.spectatorCount >= 1;

    useEffect(() => {
        if (gameRoom.exitRoom) {
            history.replace(ROUTES.HOME);
        }
    }, [gameRoom.exitRoom, history]);

    useEffect(() => {
        if (gameRoom.spectatorCount === 0) {
            return;
        }
        if (isHost) handlePushUpdateRef.current && handlePushUpdateRef.current();
    }, [gameRoom.spectatorCount, isHost]);

    const onCopyRoomLink = () => {
        navigator.clipboard
            .writeText(copyRoomRef.current?.innerText || window.location.href)
            .then(() => {
                console.log('Copy successful');
            })
            .catch((error) => {
                alert(`Copy failed! ${error}`);
            });
    };

    const isPlayer = gameRoom.member === GameRoomMember.PLAYER;
    const isOffline = false;

    return (
        <div className="relative min-h-screen flex items-center w-full">
            <AiOutlineClose
                onClick={() => {
                    handleRoomExit();
                }}
                className="text-4xl transform hover:scale-110 text-red-500 cursor-pointer absolute right-0 top-4"
            />

            <div className="py-10">
                {roomHasSpectator && (
                    <div className="flex">
                        <span>{gameRoom.spectatorCount}</span>
                        <AiFillEye className="text-green-500 text-2xl" />
                    </div>
                )}
                {/* Room Create */}
                {isHost && gameRoom.roomStatus === GameRoomStatus.CREATED && !gameRoom.playerJoin && !gameRoom.playerExit && (
                    <div>
                        <div className="mt-3 mb-16">Waiting for opponent...</div>
                        <div className="my-3 text-sm">Share this link with the participants</div>
                        <div
                            className="my-3 border rounded-md p-3 flex items-center hover:bg-white hover:bg-opacity-30 cursor-pointer"
                            onClick={onCopyRoomLink}
                        >
                            <span ref={copyRoomRef} className="text-xs px-1">
                                {window.location.href}
                            </span>
                            <AiOutlineCopy className="px-1 text-4xl inline-block text-blue-600" />
                        </div>
                    </div>
                )}
                {/* Loading screen */}

                {gameRoom.roomStatus === GameRoomStatus.LOADING && (
                    <div>
                        <div className="mt-3 mb-16">Connecting to room...</div>
                    </div>
                )}
                {((isHost && gameRoom.playerJoin && gameRoom.roomStatus === GameRoomStatus.CREATED) ||
                    (!isHost && gameRoom.roomStatus === GameRoomStatus.CREATED)) && (
                    <GameController
                        isPlayer={isPlayer}
                        isOffline={isOffline}
                        isHost={isHost}
                        render={({ game, handleRestart, handleExit, handlePlay, handlePushUpdate }) => {
                            handlePushUpdateRef.current = handlePushUpdate;

                            return (
                                <Fragment>
                                    {game.gameStatus === GameStatus.LOADING && <div>Loading game...</div>}
                                    {game.gameStatus === GameStatus.FAILED && <div>Unable to load game. Please try again!</div>}
                                    {game.gameStatus === GameStatus.LOADED && (
                                        <Fragment>
                                            <Game isPlayer={isPlayer} game={game} handlePlay={handlePlay} />
                                            {gameRoom.member === GameRoomMember.PLAYER ? (
                                                <div className="my-6 text-center">
                                                    <button
                                                        className={`${
                                                            game.isCurrentCompleted
                                                                ? 'text-green-500 cursor-pointer hover:underline'
                                                                : 'text-gray-500 cursor-default'
                                                        }`}
                                                        disabled={!game.isCurrentCompleted}
                                                        onClick={handleRestart}
                                                    >
                                                        Play Again{' '}
                                                    </button>

                                                    {game.playAgainStatus === PlayAgainStatus.PENDING_REQUEST && (
                                                        <div className="my-6">Waiting for opponent to accept...</div>
                                                    )}
                                                    {game.playAgainStatus === PlayAgainStatus.PENDING_RESPONSE && (
                                                        <div className="my-6">Opponent wants to play again...</div>
                                                    )}
                                                </div>
                                            ) : null}
                                        </Fragment>
                                    )}
                                </Fragment>
                            );
                        }}
                    />
                )}

                {gameRoom.playerExit && (
                    <div>
                        <div className="mt-3 mb-16">
                            Player left room...returning home{' '}
                            {
                                <Timer
                                    startValue={5}
                                    endValue={0}
                                    onEnd={() => handleRoomExit()}
                                    render={(time, handleCancel) => {
                                        return <span>( {time} ) </span>;
                                    }}
                                />
                            }
                        </div>
                    </div>
                )}
                {gameRoom.roomStatus === GameRoomStatus.REJECTED && (
                    <div>
                        <div className="mt-3 mb-16">
                            Unable to connect to game room...returning home{' '}
                            {
                                <Timer
                                    startValue={5}
                                    endValue={0}
                                    onEnd={() => handleRoomExit()}
                                    render={(time, handleCancel) => {
                                        return <span>( {time} ) </span>;
                                    }}
                                />
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameRoom;
