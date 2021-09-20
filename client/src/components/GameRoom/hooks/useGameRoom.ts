import { useCallback, useEffect, useReducer } from 'react';
import roomService from '../../../services/room-service';
import socketService from '../../../services/socket-service';
import { GameRoomAction, GameRoomActionTypes, GameRoomMember, GameRoomState, GameRoomStatus } from '../../../types/game-room';

const initialState: GameRoomState = {
    playerJoin: false,
    playerExit: false,
    spectatorCount: 0,
    roomStatus: GameRoomStatus.LOADING,
    exitRoom: false,
    member: null,
};

function gameRoomReducer(state: GameRoomState, action: GameRoomAction): GameRoomState {
    switch (action.type) {
        case GameRoomActionTypes.ROOM_STATUS:
            return {
                ...state,
                roomStatus: action.payload.roomStatus,
            };

        case GameRoomActionTypes.ADD_ROOM_MEMBER:
            return {
                ...state,
                member: action.payload.member,
            };
        case GameRoomActionTypes.EXIT_ROOM:
            return {
                ...state,
                exitRoom: true,
            };

        case GameRoomActionTypes.PLAYER_JOINED:
            return {
                ...state,
                playerJoin: true,
                playerExit: false,
            };
        case GameRoomActionTypes.PLAYER_EXIT:
            return {
                ...state,
                playerJoin: false,
                playerExit: true,
            };

        case GameRoomActionTypes.SPECTATOR_JOIN:
            return {
                ...state,
                spectatorCount: state.spectatorCount + 1,
            };

        case GameRoomActionTypes.UPDATE_ON_JOIN:
            return {
                ...state,
                spectatorCount: action.payload.spectatorCount,
            };

        case GameRoomActionTypes.SPECTATOR_EXIT:
            return {
                ...state,
                spectatorCount: state.spectatorCount - 1,
            };

        default:
            throw new Error(`Unhandled type in gameRoomReducer`);
    }
}

function useGameRoom(
    isHost: boolean,
    roomId: string
): {
    gameRoom: GameRoomState;
    handleRoomExit: () => void;
} {
    const [gameRoom, dispatch] = useReducer(gameRoomReducer, initialState);

    const { roomStatus, member } = gameRoom;
    const roomCreated = roomStatus === GameRoomStatus.CREATED;
    const isSpectator = member === GameRoomMember.SPECTATOR;

    // Exit room handler
    const handleRoomExit = useCallback(() => {
        if (!socketService.socket?.connected) {
            dispatch({ type: GameRoomActionTypes.EXIT_ROOM });
        }
        socketService.disconnect();
    }, []);

    // HOST: Create and join room
    useEffect(() => {
        if (!roomId || !isHost || roomCreated) return;
        async function handleCreateRoom() {
            try {
                await socketService.connect();
                roomService.onCreatedRoom((msg) => {
                    // dispatch({ type: GameRoomActionTypes.ROOM_STATUS });
                    dispatch({ type: GameRoomActionTypes.ROOM_STATUS, payload: { roomStatus: GameRoomStatus.CREATED } });
                    dispatch({ type: GameRoomActionTypes.ADD_ROOM_MEMBER, payload: { member: GameRoomMember.PLAYER } });
                });

                roomService.createRoom(roomId);
            } catch (err) {
                console.log(err);
            }
        }
        handleCreateRoom();
    }, [roomId, isHost, roomCreated]);

    // PLAYER/OPPONENT: Join room

    useEffect(() => {
        async function handleJoinRoom() {
            try {
                await socketService.connect();

                roomService.joinRoom(roomId);
            } catch (err) {
                console.log(err);
            }
        }
        if (!isHost) {
            handleJoinRoom();
        }
    }, [isHost, roomId]);

    // Event handlers

    useEffect(() => {
        roomService.onJoinedRoom(({ isPlayer, message, isBroadcaster }) => {
            if (isPlayer) {
                if (isBroadcaster) {
                    dispatch({ type: GameRoomActionTypes.ADD_ROOM_MEMBER, payload: { member: GameRoomMember.PLAYER } });
                    dispatch({ type: GameRoomActionTypes.ROOM_STATUS, payload: { roomStatus: GameRoomStatus.CREATED } });
                }
                dispatch({ type: GameRoomActionTypes.PLAYER_JOINED });
            } else {
                if (isBroadcaster) {
                    dispatch({ type: GameRoomActionTypes.ADD_ROOM_MEMBER, payload: { member: GameRoomMember.SPECTATOR } });
                    // dispatch({ type: GameRoomActionTypes.ROOM_STATUS, payload: { roomStatus: GameRoomStatus.CREATED } });
                } else {
                    dispatch({ type: GameRoomActionTypes.SPECTATOR_JOIN });
                }
            }
        });

        roomService.onJoinedRoomError(({ message }) => {
            dispatch({ type: GameRoomActionTypes.ROOM_STATUS, payload: { roomStatus: GameRoomStatus.REJECTED } });

            console.log(message);
        });

        roomService.onExitedRoom(({ isPlayer }) => {
            if (isPlayer) {
                // roomService.exitRoom(roomId);
                dispatch({ type: GameRoomActionTypes.PLAYER_EXIT });
            } else {
                dispatch({ type: GameRoomActionTypes.SPECTATOR_EXIT });
            }
        });

        roomService.onExitRoomError(({ message }) => {
            socketService.disconnect();
            dispatch({ type: GameRoomActionTypes.EXIT_ROOM });
        });

        socketService.socket?.on('disconnect', () => {
            dispatch({ type: GameRoomActionTypes.EXIT_ROOM });
        });

        return () => {
            socketService.disconnect();
        };
    }, []);

    useEffect(() => {}, []);

    useEffect(() => {
        if (isSpectator) {
            roomService.onRoomPushUpdate((spectatorCount) => {
                dispatch({ type: GameRoomActionTypes.ROOM_STATUS, payload: { roomStatus: GameRoomStatus.CREATED } });
                dispatch({ type: GameRoomActionTypes.UPDATE_ON_JOIN, payload: { spectatorCount } });
            });
        }
    }, [isSpectator]);

    useEffect(() => {
        if (gameRoom.spectatorCount === 0) {
            return;
        }
        roomService.roomPushUpdate(gameRoom.spectatorCount);
    }, [gameRoom.spectatorCount]);

    useEffect(() => {}, []);

    return {
        gameRoom,
        handleRoomExit,
    };
}
export default useGameRoom;
