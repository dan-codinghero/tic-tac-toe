import { Server, Socket } from 'socket.io';
import { GamePlayers } from '../Room';
import { Players } from '../types/game';
import { RoomEvents } from '../types/socket';

const roomHandlers = (io: Server, socket: Socket) => {
    const createRoom = async (room: string) => {
        const roomExists = Array.from(socket.rooms.values()).some((r) => r === room);
        if (roomExists) {
            socket.emit(RoomEvents.CreateError, 'Room already exists. Please create another room.');
        } else {
            await socket.join(room);
            GamePlayers.push(socket.id);
            socket.emit(RoomEvents.Created, 'Room created successfully!');
        }

        // ...
    };

    const joinRoom = async (room: string) => {
        const connectedSockets = io.sockets.adapter.rooms.get(room);
        if (!connectedSockets) {
            socket.emit(RoomEvents.JoinError, { message: 'Invalid game room!' });
        }
        if (connectedSockets && connectedSockets?.size >= 2) {
            await socket.join(room);
            socket.emit(RoomEvents.Joined, { message: 'Room joined.', isPlayer: false, isBroadcaster: true });
            socket.to(room).emit(RoomEvents.Joined, { message: 'Spectator joined room.', isPlayer: false, isBroadcaster: false });
        } else if (connectedSockets && connectedSockets?.size === 1) {
            await socket.join(room);
            GamePlayers.push(socket.id);

            socket.emit(RoomEvents.Joined, { message: 'Connected to game!', isPlayer: true, isBroadcaster: true });
            socket.to(room).emit(RoomEvents.Joined, { message: 'Opponent joined room.', isPlayer: true, isBroadcaster: false });
        }
    };

    const updateRoom = async (spectatorCount: { spectatorCount: number }) => {
        const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);
        socket.to(gameRoom).emit(RoomEvents.Update, spectatorCount);
    };
    socket.on(RoomEvents.Create, createRoom);
    socket.on(RoomEvents.Join, joinRoom);
    socket.on(RoomEvents.Update, updateRoom);
};

export default roomHandlers;
