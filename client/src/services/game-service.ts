import { GameUpdateState, Players } from '../types/game';
import { GameEvents, SocketEventHandler } from '../types/socket';
import socketService from './socket-service';

export enum GameServiceActionTypes {
    SPECTATOR_JOIN = 'SpectatorJoin',
    PLAYER_MOVE = 'PlayerMove',
}

export type GameServiceAction =
    | {
          type: GameServiceActionTypes.SPECTATOR_JOIN;
          payload: {
              game: GameUpdateState;
          };
      }
    | {
          type: GameServiceActionTypes.PLAYER_MOVE;
          payload: {
              squares: Players[];
          };
      };

export const gameService = () => {
    const onGamePushUpdate = (listener: SocketEventHandler) => {
        socketService.socket?.on(GameEvents.Update, listener);
    };

    const gamePushUpdate = (action: GameServiceAction) => {
        socketService.socket?.emit(GameEvents.Update, { ...action });
    };

    const gameEnd = ({ squares, winner }: { squares: Players[]; winner: Players | null }) => {
        socketService.socket?.emit(GameEvents.End, { squares, winner });
    };

    const onGameEnd = (listener: SocketEventHandler) => {
        socketService.socket?.on(GameEvents.End, listener);
    };

    const gameRestart = () => {
        socketService.socket?.emit(GameEvents.Restart);
    };

    const onGameRestart = (listener: SocketEventHandler) => {
        socketService.socket?.on(GameEvents.Restart, listener);
    };

    const gameRestartAccepted = () => {
        socketService.socket?.emit(GameEvents.RestartAccepted);
    };

    const onGameRestartAccepted = (listener: SocketEventHandler) => {
        socketService.socket?.on(GameEvents.RestartAccepted, listener);
    };
    return {
        gamePushUpdate,
        onGamePushUpdate,
        gameEnd,
        onGameEnd,
        gameRestart,
        onGameRestart,
        gameRestartAccepted,
        onGameRestartAccepted,
    };
};

export default gameService();
