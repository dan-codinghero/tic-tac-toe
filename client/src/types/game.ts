export enum Players {
    X = 'X',
    O = 'O',
}

export type ScoreCard = {
    [Players.X]: number;
    [Players.O]: number;
};

export enum GameStatus {
    LOADING = 'Loading',
    LOADED = 'Loaded',
    FAILED = 'Failed',
}

export type GameState = {
    squares: Players[];
    player: Players | null;
    currentPlayer: Players;
    scoreCard: ScoreCard;
    hasStart: boolean;
    isCurrentCompleted: boolean;
    winner: Players | null;
    playAgainStatus: PlayAgainStatus | null;
    gameStatus: GameStatus;
};

export type GameUpdateState = Omit<GameState, 'player' | 'gameStatus'>;

export enum GameModeTypes {
    ONLINE_FRIEND = 'OnlineFriend',
    OFFLINE_FRIEND = 'OfflineFriend',
}

export enum GameActionTypes {
    SET_PLAYER = 'SetPlayer',
    GAME_START = 'GameStart',
    PLAYER_MOVE = 'PlayerMove',
    SWAP_PLAYER = 'SwapPlayer',
    GAME_END = 'GameEnd',
    GAME_RESTART = 'GameRestart',
    GAME_QUIT = 'GameQuit',
    PLAY_AGAIN_STATUS = 'PlayAgainStatus',
    UPDATE_ON_JOIN = 'UpdateOnJoin',
    GAME_STATUS = 'GameStatus',
}
export enum PlayAgainStatus {
    PENDING_RESPONSE = 'PendingResponse',
    PENDING_REQUEST = 'PendingRequest',
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected',
}

export type GameAction =
    | {
          type: GameActionTypes.GAME_STATUS;
          payload: { gameStatus: GameStatus };
      }
    | {
          type: GameActionTypes.GAME_START;
      }
    | {
          type: GameActionTypes.SET_PLAYER;
          payload: {
              player: Players;
          };
      }
    | {
          type: GameActionTypes.PLAYER_MOVE;
          payload: {
              squares: Players[];
          };
      }
    | {
          type: GameActionTypes.GAME_END;
          payload: {
              squares: Players[];
              winner: Players | null;
          };
      }
    | {
          type: GameActionTypes.GAME_RESTART;
      }
    | {
          type: GameActionTypes.SWAP_PLAYER;
      }
    | {
          type: GameActionTypes.GAME_QUIT;
      }
    | {
          type: GameActionTypes.PLAY_AGAIN_STATUS;
          payload: { playAgainStatus: PlayAgainStatus | null };
      }
    | {
          type: GameActionTypes.UPDATE_ON_JOIN;
          payload: { game: GameUpdateState };
      };

export type UseGameOptions = {
    // isOffline?: boolean;
    isHost?: boolean;
    isPlayer?: boolean;
};

export type GameReducerFunction = (state: GameState, action: GameAction) => GameState;
export type GameModeSelectionFunction = (mode: GameModeTypes) => void;
