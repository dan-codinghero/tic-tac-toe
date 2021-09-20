import { RoomEvents, SocketEventHandler } from '../types/socket';
import socketService from './socket-service';

const roomService = () => {
    const createRoom = (roomName: string) => {
        socketService.socket?.emit(RoomEvents.Create, roomName);
    };

    const onCreatedRoom = (listener: SocketEventHandler) => {
        socketService.socket?.on(RoomEvents.Created, listener);
    };

    const onCreatedRoomError = (listener: SocketEventHandler) => {
        socketService.socket?.on(RoomEvents.CreateError, listener);
    };

    const joinRoom = (roomName: string) => {
        socketService.socket?.emit(RoomEvents.Join, roomName);
    };

    const onJoinedRoom = (listener: SocketEventHandler) => {
        socketService.socket?.on(RoomEvents.Joined, listener);
    };

    const onJoinedRoomError = (listener: SocketEventHandler) => {
        socketService.socket?.on(RoomEvents.JoinError, listener);
    };

    // const exitRoom = (room: string) => {
    //     // const exitRoom = (room: string, isPlayer: boolean) => {
    //     socketService.socket?.emit(RoomEvents.Exit, { room });
    //     // socketService.socket?.emit(RoomEvents.Exit, { room, isPlayer });
    // };

    const roomPushUpdate = (spectatorCount: number) => {
        socketService.socket?.emit(RoomEvents.Update, spectatorCount);
    };

    const onRoomPushUpdate = (listener: SocketEventHandler) => {
        socketService.socket?.on(RoomEvents.Update, listener);
    };

    const onExitedRoom = (listener: SocketEventHandler) => {
        socketService.socket?.on(RoomEvents.Exited, listener);
    };
    const onExitRoomError = (listener: SocketEventHandler) => {
        socketService.socket?.on(RoomEvents.ExitError, listener);
    };

    return {
        createRoom,
        onCreatedRoom,
        onCreatedRoomError,
        joinRoom,
        onJoinedRoom,
        onJoinedRoomError,
        roomPushUpdate,
        onRoomPushUpdate,
        // exitRoom,
        onExitRoomError,
        onExitedRoom,
    };
};

export default roomService();
