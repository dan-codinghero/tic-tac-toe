"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const environment_variables_1 = require("./environment-variables");
const room_handler_1 = __importDefault(require("./handlers/room-handler"));
const game_handler_1 = __importDefault(require("./handlers/game-handler"));
const Room_1 = require("./Room");
const socket_1 = require("./types/socket");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, express_1.default)());
app.use((0, cors_1.default)({
    origin: environment_variables_1.ALLOW_ORIGINS,
}));
app.use('/', (req, res, next) => {
    res.send('<h3>Tic-Tac-Toe server loaded...</h3>');
});
const server = app.listen(environment_variables_1.PORT, () => console.log(`Server is running on port ${environment_variables_1.PORT}`));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: environment_variables_1.ALLOW_ORIGINS,
    },
});
io.on('connection', (socket) => {
    (0, room_handler_1.default)(io, socket);
    (0, game_handler_1.default)(io, socket);
    socket.on('disconnecting', () => {
        const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);
        if (Room_1.GamePlayers.includes(socket.id)) {
            socket.to(gameRoom).emit(socket_1.RoomEvents.Exited, { message: `'Opponent' left the room.`, isPlayer: true });
            const idx = Room_1.GamePlayers.findIndex((player) => player === socket.id);
            Room_1.GamePlayers.splice(idx, 1);
        }
        else {
            socket.to(gameRoom).emit(socket_1.RoomEvents.Exited, { message: `'Spectator' left the room.`, isPlayer: false });
        }
    });
});
