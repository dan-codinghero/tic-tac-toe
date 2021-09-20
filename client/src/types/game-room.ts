export enum GameRoomMember {
    PLAYER = 'Player',
    SPECTATOR = 'Spectator',
}

export enum GameRoomStatus {
    CREATED = 'Created',
    LOADING = 'Loading',
    REJECTED = 'Rejected',
}

export type GameRoomState = {
    roomStatus: GameRoomStatus;
    playerJoin: boolean;
    playerExit: boolean;
    spectatorCount: number;
    exitRoom: boolean;
    member: GameRoomMember | null;
};

export enum GameRoomActionTypes {
    ROOM_STATUS = 'RoomStatus',
    ADD_ROOM_MEMBER = 'AddRoomMember',
    EXIT_ROOM = 'ExitRoom',
    PLAYER_JOINED = 'PlayerJoined',
    SPECTATOR_JOIN = 'SpectatorJoined',
    PLAYER_EXIT = 'PlayerExit',
    SPECTATOR_EXIT = 'SpectatorExit',
    UPDATE_ON_JOIN = 'UpdateOnJoin',
}

export type GameRoomAction =
    | {
          type: GameRoomActionTypes.ROOM_STATUS;
          payload: { roomStatus: GameRoomStatus };
      }
    | {
          type: GameRoomActionTypes.EXIT_ROOM;
      }
    | {
          type: GameRoomActionTypes.ADD_ROOM_MEMBER;
          payload: { member: GameRoomMember };
      }
    | {
          type: GameRoomActionTypes.PLAYER_JOINED;
      }
    | {
          type: GameRoomActionTypes.PLAYER_EXIT;
      }
    | {
          type: GameRoomActionTypes.SPECTATOR_JOIN;
      }
    | {
          type: GameRoomActionTypes.SPECTATOR_EXIT;
      }
    | {
          type: GameRoomActionTypes.UPDATE_ON_JOIN;
          payload: { spectatorCount: number };
      };

export type GameRoomHistoryState = {
    from: string;
    host: boolean;
    isOffline: boolean;
    room: '';
};
