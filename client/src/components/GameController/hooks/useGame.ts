import { useCallback, useEffect, useReducer } from 'react';
import gameService, { GameServiceAction, GameServiceActionTypes } from '../../../services/game-service';
import { GameActionTypes, GameAction, GameState, Players, ScoreCard, UseGameOptions, PlayAgainStatus, GameStatus } from '../../../types/game';
import { checkGameStatus } from '../utils/game-status';

const initialState: GameState = {
    squares: Array(9).fill(''),
    player: null,
    currentPlayer: Players.X,
    scoreCard: { [Players.X]: 0, [Players.O]: 0 },
    hasStart: false,
    isCurrentCompleted: false,
    winner: null,
    playAgainStatus: null,
    gameStatus: GameStatus.LOADING,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case GameActionTypes.GAME_START:
            return { ...state, hasStart: true };

        case GameActionTypes.SET_PLAYER:
            return {
                ...state,
                player: action.payload.player,
            };
        case GameActionTypes.SWAP_PLAYER:
            return {
                ...state,
                player: state.player === Players.X ? Players.O : Players.X,
            };

        case GameActionTypes.GAME_STATUS:
            return { ...state, gameStatus: action.payload.gameStatus };
        case GameActionTypes.PLAYER_MOVE:
            return {
                ...state,
                squares: action.payload.squares,
                currentPlayer: state.currentPlayer === Players.X ? Players.O : Players.X,
            };
        case GameActionTypes.UPDATE_ON_JOIN:
            return { ...state, ...action.payload.game };
        case GameActionTypes.GAME_END:
            const scores = { ...state.scoreCard };
            return {
                ...state,
                squares: action.payload.squares,
                ...(action.payload.winner ? { winner: action.payload.winner } : {}),
                isCurrentCompleted: true,
                scoreCard: action.payload.winner ? { ...scores, [action.payload.winner]: scores[action.payload.winner as Players] + 1 } : scores,
            };
        case GameActionTypes.GAME_RESTART:
            return {
                ...state,
                squares: Array(9).fill(''),
                isCurrentCompleted: false,
                winner: null,
                currentPlayer: state.currentPlayer === Players.X ? Players.O : Players.X,
            };
        case GameActionTypes.PLAY_AGAIN_STATUS:
            return {
                ...state,
                playAgainStatus: action.payload.playAgainStatus,
            };
        case GameActionTypes.GAME_QUIT:
            return { ...initialState };
        default:
            throw new Error(`Unhandled type in gameReducer`);
    }
}

const initFunc = (initialState: GameState): GameState => {
    const scores = window.sessionStorage.getItem('scoreCard');
    if (scores) {
        return { ...initialState, scoreCard: JSON.parse(scores) as ScoreCard };
    }
    return initialState;
};

function useGame(
    isOffline: boolean = true,
    opts?: UseGameOptions
): {
    game: GameState;
    handlePlay: (index: number) => void;
    handleRestart: () => void;
    handleExit: () => void;
    handlePushUpdate: () => void;
} {
    const [game, dispatch] = useReducer(gameReducer, initialState, initFunc);

    // const isOffline = opts?.isOffline;
    const isHost = opts?.isHost;
    const isPlayer = opts?.isPlayer;

    // Init game for players
    useEffect(() => {
        dispatch({ type: GameActionTypes.GAME_START });

        if (isPlayer && !isOffline) {
            dispatch({ type: GameActionTypes.SET_PLAYER, payload: { player: isHost ? Players.X : Players.O } });
            dispatch({ type: GameActionTypes.GAME_STATUS, payload: { gameStatus: GameStatus.LOADED } });
        }
        if (isOffline) {
            dispatch({ type: GameActionTypes.SET_PLAYER, payload: { player: Players.X } });
            dispatch({ type: GameActionTypes.GAME_STATUS, payload: { gameStatus: GameStatus.LOADED } });
        }
    }, [isOffline, isHost, isPlayer]);

    // Handle Play again accepted

    useEffect(() => {
        if (game.playAgainStatus === PlayAgainStatus.ACCEPTED) {
            dispatch({ type: GameActionTypes.PLAY_AGAIN_STATUS, payload: { playAgainStatus: null } });
            dispatch({ type: GameActionTypes.GAME_RESTART });
        }
    }, [game.playAgainStatus, isOffline]);

    // Event handlers

    useEffect(() => {
        gameService.onGamePushUpdate((action: GameServiceAction) => {
            switch (action.type) {
                case GameServiceActionTypes.PLAYER_MOVE:
                    dispatch({ type: GameActionTypes.PLAYER_MOVE, payload: { squares: action.payload.squares } });

                    break;
                case GameServiceActionTypes.SPECTATOR_JOIN:
                    dispatch({ type: GameActionTypes.UPDATE_ON_JOIN, payload: { game: action.payload.game } });
                    dispatch({ type: GameActionTypes.GAME_STATUS, payload: { gameStatus: GameStatus.LOADED } });
                    break;
                default:
                    break;
            }
        });
        gameService.onGameEnd(({ squares, winner }) => {
            dispatch({
                type: GameActionTypes.GAME_END,
                payload: { squares, winner },
            });
        });

        gameService.onGameRestart(() => {
            dispatch({ type: GameActionTypes.PLAY_AGAIN_STATUS, payload: { playAgainStatus: PlayAgainStatus.PENDING_RESPONSE } });
        });

        gameService.onGameRestartAccepted(() => {
            dispatch({ type: GameActionTypes.PLAY_AGAIN_STATUS, payload: { playAgainStatus: PlayAgainStatus.ACCEPTED } });
        });
    }, [isPlayer]);

    // Game play handler
    const handlePlay = useCallback(
        (index: number) => {
            if ((!isPlayer && !isOffline) || (!isOffline && isPlayer && game.player !== game.currentPlayer)) return;

            const updatedSquares = game.squares.map((square, idx) => (idx === index ? game.currentPlayer : square));
            const gameStatus = checkGameStatus(updatedSquares);

            if (gameStatus.hasEnd) {
                // Send update to room
                if (!isOffline) {
                    gameService.gameEnd({ squares: updatedSquares, winner: gameStatus.winner });
                }

                // Update current player view
                dispatch({
                    type: GameActionTypes.GAME_END,
                    payload: { squares: updatedSquares, winner: gameStatus.winner },
                });
            } else {
                // Send update to room
                if (!isOffline) {
                    gameService.gamePushUpdate({ type: GameServiceActionTypes.PLAYER_MOVE, payload: { squares: updatedSquares } });
                }

                // Swap players in offline mode
                if (isOffline) {
                    dispatch({ type: GameActionTypes.SET_PLAYER, payload: { player: game.player === Players.X ? Players.O : Players.X } });
                }

                // Update current player view
                dispatch({ type: GameActionTypes.PLAYER_MOVE, payload: { squares: updatedSquares } });
            }
        },
        [game.player, game.currentPlayer, isPlayer, isOffline, game.squares]
    );

    // Play again handler

    const handleRestart = useCallback(() => {
        // Send update to opponent
        if (!isOffline) {
            gameService.gameRestart();
            if (game.playAgainStatus === null) {
                dispatch({ type: GameActionTypes.PLAY_AGAIN_STATUS, payload: { playAgainStatus: PlayAgainStatus.PENDING_REQUEST } });
                gameService.gameRestart();
            }
            if (game.playAgainStatus === PlayAgainStatus.PENDING_RESPONSE) {
                gameService.gameRestartAccepted();
            }
        }

        if (isOffline) {
            dispatch({ type: GameActionTypes.GAME_RESTART });
            dispatch({ type: GameActionTypes.SWAP_PLAYER });
        }
    }, [isOffline, game.playAgainStatus]);

    // Handle exit
    const handleExit = useCallback(() => {
        window.sessionStorage.removeItem('scoreCard');
    }, []);

    // push game state to spectator on join
    const handlePushUpdate = useCallback(() => {
        const { gameStatus, player, ...gameState } = game;
        gameService.gamePushUpdate({ type: GameServiceActionTypes.SPECTATOR_JOIN, payload: { game: gameState } });
    }, [game]);

    // //////////////////////////////////////////////////////////////

    return {
        game,
        handlePlay,
        handleRestart,
        handleExit,
        handlePushUpdate,
    };
}

export default useGame;
