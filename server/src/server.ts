import express from 'express';
import socket, { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import { ALLOW_ORIGINS, PORT } from './environment-variables';
import roomHandlers from './handlers/room-handler';
import gameHandlers from './handlers/game-handler';
import { GamePlayers } from './Room';
import { GameEvents, RoomEvents } from './types/socket';
import { GameServiceAction } from './types/game';

const app = express();
dotenv.config();

app.use(express());

app.use(
    cors({
        origin: ALLOW_ORIGINS,
    })
);

app.use('/', (req, res, next) => {
    res.send('<h3>Tic-Tac-Toe server loaded...</h3>');
});
const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const io = new Server(server, {
    cors: {
        origin: ALLOW_ORIGINS,
    },
});

io.on('connection', (socket) => {
    roomHandlers(io, socket);
    gameHandlers(io, socket);

    socket.on('disconnecting', () => {
        const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);

        if (GamePlayers.includes(socket.id)) {
            socket.to(gameRoom).emit(RoomEvents.Exited, { message: `'Opponent' left the room.`, isPlayer: true });
            const idx = GamePlayers.findIndex((player) => player === socket.id);
            GamePlayers.splice(idx, 1);
        } else {
            socket.to(gameRoom).emit(RoomEvents.Exited, { message: `'Spectator' left the room.`, isPlayer: false });
        }
    });
});
