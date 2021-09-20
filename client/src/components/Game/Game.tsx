import React, { Fragment } from 'react';
import { GameState } from '../../types/game';
import Board from './Board/Board';
import Podium from './Podium/Podium';
import ScoreSheet from './ScoreSheet/ScoreSheet';

const Game = ({ game, handlePlay, isPlayer }: { game: GameState; isPlayer: boolean; handlePlay: (index: number) => void }) => {
    const isPlayAllowed = !isPlayer || (isPlayer && game.player !== game.currentPlayer);

    return (
        <Fragment>
            <ScoreSheet
                scoreCard={game.scoreCard}
                player={game.player || game.currentPlayer}
                {...(isPlayer ? { currentPlayer: game.currentPlayer } : {})}
            />

            {!game.isCurrentCompleted ? (
                <Board squares={game.squares} disable={isPlayAllowed} handleGamePlay={handlePlay} />
            ) : (
                <Podium winner={game.winner?.toString()} />
            )}
        </Fragment>
    );
};

export default Game;
