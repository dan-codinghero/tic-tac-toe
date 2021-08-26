const express = require('express');
const socket = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const registerRoomHandlers = require('./handlers/room-handler');
const registerGameHandlers = require('./handlers/game-handler');

const app = express();
dotenv.config();
const PORT = parseInt(process.env.PORT, 10) || 9000;
app.use(express());

const ALLOW_ORIGINS = process.env.ALLOW_ORIGINS || '*';

app.use(
    cors({
        origin: ALLOW_ORIGINS,
    })
);
const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
const io = socket(server, {
    cors: {
        origin: ALLOW_ORIGINS,
    },
});
io.on('connection', (socket) => {
    console.log('Client connected');

    registerRoomHandlers(io, socket);
    registerGameHandlers(io, socket);

    socket.on('disconnecting', () => {
        const rooms = Array.from(io.sockets.adapter.rooms).filter((r) => r !== socket.id);
        console.log('Opponent leaving the room.');
        socket.emit('game:exit', 'Room exited');
        rooms?.map((room) => {
            socket.to(room).emit('game:exit', 'Opponent left the room.');
        });
    });
});
