import React, { Fragment, useState } from 'react';
import { calculateScores, checkWin, isDraw, placeMark } from '../../helpers/game-state';
import Board from '../Board/Board';
import ScoreBoard from '../ScoreBoard/ScoreBoard';

const PLAYER_X = 'X';
const PLAYER_O = 'O';

const Game = () => {
    const persistedScoreCard = window.sessionStorage.getItem('scoreCard');
    const [tiles, setTiles] = useState(Array(9).fill(''));
    const [player, setPlayer] = useState('X');
    const [scoreCard, setScoreCard] = useState(JSON.parse(persistedScoreCard) || { X: 0, O: 0, Tie: 0 });
    const [hasGameEnd, setHasGameEnd] = useState(false);
    const [hasGameStart, setHasGameStart] = useState(false);
    const [gameWinner, setGameWinner] = useState('');

    const resetGame = () => {
        setHasGameEnd(false);
        setTiles(Array(9).fill(''));
        setHasGameStart(false);
        setPlayer('X');
    };

    const handleRestartGame = () => {
        resetGame();
    };

    const handleQuitGame = () => {
        resetGame();
        setScoreCard({ X: 0, O: 0, Tie: 0 });

        window.sessionStorage.removeItem('scoreCard');
    };

    const handleGamePlay = async (tileIdx) => {
        if (tiles[tileIdx] !== '' || hasGameEnd) {
            return;
        }
        if (!hasGameStart) setHasGameStart(true);

        const updatedTiles = placeMark(tileIdx, tiles, player);

        if (checkWin(updatedTiles)) {
            setScoreCard(calculateScores(false, scoreCard, player));
            setHasGameEnd(true);
            setGameWinner(player);
        } else if (isDraw(updatedTiles)) {
            setScoreCard(calculateScores(true, scoreCard, player));
            setHasGameEnd(true);
            setGameWinner(player);
        } else {
            setPlayer((prevState) => (prevState === PLAYER_X ? PLAYER_O : PLAYER_X));
        }

        setTiles(updatedTiles);
    };

    const renderGamePlayText = () => {
        if (!hasGameStart) return 'Click tile to start game';
        if (hasGameStart && !hasGameEnd) return `${player} Turn`;
        return 'Game Over';
    };

    return (
        <Fragment>
            <div className="border rounded-md p-4 relative" style={{ minWidth: '40rem' }}>
                <ScoreBoard scoreCard={scoreCard} />

                <div className="text-center mb-6">{renderGamePlayText()}</div>

                {hasGameEnd && (
                    <div className="w-44 h-44 mx-auto flex flex-col text-center justify-center border">
                        <span className="text-6xl inline-block">{!isDraw(tiles) ? `${gameWinner}` : 'XO'}</span>
                        <span className="inline-block mt-2">{!isDraw(tiles) ? 'Winner!' : 'Draw!'}</span>
                    </div>
                )}
                {!hasGameEnd && <Board tiles={tiles} handleGamePlay={handleGamePlay} />}

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
                        className={`${hasGameStart ? 'text-red-500 cursor-pointer' : 'text-gray-500 cursor-default'}`}
                        disabled={!hasGameStart}
                        onClick={handleQuitGame}
                    >
                        Quit
                    </button>
                </div>
            </div>
        </Fragment>
    );
};

export default Game;
