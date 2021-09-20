import { FC, Fragment } from 'react';
import { GameState } from '../../types/game';
import useGame from './hooks/useGame';

type GameProps = {
    isPlayer?: boolean;
    isOffline?: boolean;
    isHost?: boolean;
    render?: ({ game, handleRestart, handleExit }: GameRenderProps) => any;
};

type GameRenderProps = {
    game: GameState;
    handlePlay: (index: number) => void;
    handleRestart: () => void;
    handleExit: () => void;
    handlePushUpdate: () => void;
};

const GameController: FC<GameProps> = ({ isHost, isPlayer = true, isOffline = true, render }) => {
    const { game, handlePlay, handleRestart, handleExit, handlePushUpdate } = useGame(isOffline, { isHost, isPlayer });

    return (
        <Fragment>
            <div className={``}>{render?.({ game, handlePlay, handleRestart, handleExit, handlePushUpdate })}</div>
        </Fragment>
    );
};

export default GameController;
