export enum Players {
    X = 'X',
    O = 'O',
}

export type ScoreCard = {
    [Players.X]: number;
    [Players.O]: number;
};

export enum GameServiceActionTypes {
    SPECTATOR_JOIN = 'SpectatorJoin',
    PLAYER_MOVE = 'PlayerMove',
}

export type GameServiceAction =
    | {
          type: GameServiceActionTypes.SPECTATOR_JOIN;
          payload: {
              game: GameState;
          };
      }
    | {
          type: GameServiceActionTypes.PLAYER_MOVE;
          payload: {
              squares: Pick<GameState, 'squares'>;
          };
      };

export type GameState = {
    squares: Players[];
    player: Players;
    currentPlayer: Players;
    scoreCard: ScoreCard;
    hasStart: boolean;
    isCurrentCompleted: boolean;
    winner: Players | null;
    playAgainStatus: PlayAgainStatus | null;
};

export enum PlayAgainStatus {
    PENDING_RESPONSE = 'PendingResponse',
    PENDING_REQUEST = 'PendingRequest',
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected',
}
