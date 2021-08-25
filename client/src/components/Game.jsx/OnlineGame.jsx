import React, { Fragment, useEffect, useState } from 'react';
import { calculateScores, checkWin, isDraw, placeMark } from '../../helpers/game-state';
import gameService from '../../services/game-service';
import Board from '../Board/Board';
import ScoreBoard from '../ScoreBoard/ScoreBoard';

const PLAYER_X = 'X';
const PLAYER_O = 'O';

// const intialState = {
//     tiles: Array(9).fill(''),
//     player: 'X',
//     scoreCard: { X: 0, O: 0, Tie: 0 },
//     hasGameEnd: false,
// };

// function reducer(state, action) {}

const OnlineGame = ({ socket, room = '', handleExitRoom, handleToastMessage }) => {
    const persistedScoreCard = window.sessionStorage.getItem('scoreCard');
    const [tiles, setTiles] = useState(Array(9).fill(''));
    const [player, setPlayer] = useState('X');
    const [scoreCard, setScoreCard] = useState(JSON.parse(persistedScoreCard) || { X: 0, O: 0, Tie: 0 });
    const [hasGameEnd, setHasGameEnd] = useState(false);
    const [hasGameStart, setHasGameStart] = useState(false);
    const [gameWinner, setGameWinner] = useState('');

    const [isPlayerTurn, setIsPlayerTurn] = useState(false);

    useEffect(() => {
        if (socket) {
            socket.on('game:start', ({ isNext, isPlayerX }) => {
                setIsPlayerTurn(isNext);
                setHasGameStart(true);
                setPlayer(isPlayerX ? PLAYER_X : PLAYER_O);
            });

            socket.on('game:update', ({ updatedTiles }) => {
                setTiles(updatedTiles);
                setIsPlayerTurn(true);
            });

            socket.on('game:end', ({ updatedTiles, scores, winner }) => {
                console.log({ updatedTiles, scores, winner });
                setTiles(updatedTiles);
                setScoreCard(scores);
                setHasGameEnd(true);
                setGameWinner(winner);
            });

            socket.on('game:restart', ({ isPlayerTurn }) => {
                console.log({ isPlayerTurn });
                setIsPlayerTurn(isPlayerTurn);

                setHasGameStart(true);
                setHasGameEnd(false);
                setTiles(Array(9).fill(''));
                setGameWinner('');
            });
        }
    }, [socket]);

    const resetGame = () => {
        setHasGameEnd(false);
        setTiles(Array(9).fill(''));
        setHasGameStart(false);
    };

    const handleRestartGame = () => {
        resetGame();

        gameService.restartGame({ socket, room, isPlayerTurn: player === gameWinner ? true : false });
    };

    const handleQuitGame = () => {
        window.sessionStorage.removeItem('scoreCard');

        handleExitRoom();
    };

    const handleGamePlay = async (tileIdx) => {
        if (tiles[tileIdx] !== '' || hasGameEnd) {
            return;
        }
        if (!hasGameStart) setHasGameStart(true);

        const updatedTiles = placeMark(tileIdx, tiles, player);
        const currentPlayer = player;

        if (checkWin(updatedTiles)) {
            const scores = calculateScores(false, scoreCard, currentPlayer);
            setHasGameEnd(true);
            setScoreCard(scores);
            setGameWinner(player);
            await gameService.endGame({ socket, room, updatedTiles, scores, winner: currentPlayer });
        } else if (isDraw(updatedTiles)) {
            const scores = calculateScores(true, scoreCard, currentPlayer);

            setHasGameEnd(true);
            setScoreCard(scores);
            await gameService.endGame({ socket, room, updatedTiles, scores, winner: currentPlayer });
        } else {
            setIsPlayerTurn(false);
        }

        await gameService.updateGame({ socket, room, updatedTiles });
        setTiles(updatedTiles);
    };

    const renderGamePlayText = () => {
        if (!hasGameStart) return 'Click tile to start game';
        if (hasGameStart && !hasGameEnd) return `Player ${player}`;
        return 'Game Over';
    };

    return (
        <Fragment>
            <div className="border rounded-md p-4 relative" style={{ minWidth: '40rem' }}>
                <ScoreBoard scoreCard={scoreCard} />

                <div className="text-center mb-6">{renderGamePlayText()}</div>
                {!hasGameEnd && hasGameStart && <div className="text-center mb-6">{isPlayerTurn ? 'Your play' : "Opponent's play"}</div>}
                {hasGameEnd && (
                    <div className="w-44 h-44 mx-auto flex flex-col text-center justify-center border">
                        <span className="text-6xl inline-block">{!isDraw(tiles) ? `${gameWinner}` : 'XO'}</span>
                        <span className="inline-block mt-2">{!isDraw(tiles) ? 'Winner!' : 'Draw!'}</span>
                    </div>
                )}
                {!hasGameEnd && <Board tiles={tiles} disablePlayerMove={!isPlayerTurn ? true : false} handleGamePlay={handleGamePlay} />}

                <div className="mt-6 text-center">
                    <button
                        className={`${hasGameStart ? 'text-green-500 cursor-pointer' : 'text-gray-500 cursor-default'}`}
                        disabled={!hasGameStart}
                        onClick={handleRestartGame}
                    >
                        Restart
                    </button>
                </div>

                <div className={`mt-5  text-center `}>
                    <button
                        className={`${room ? 'text-red-500 cursor-pointer' : 'text-gray-500 cursor-default'}`}
                        disabled={!room}
                        onClick={handleQuitGame}
                    >
                        Quit
                    </button>
                </div>
            </div>
        </Fragment>
    );
};

export default OnlineGame;
