"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("../Room");
const socket_1 = require("../types/socket");
const roomHandlers = (io, socket) => {
    const createRoom = (room) => __awaiter(void 0, void 0, void 0, function* () {
        const roomExists = Array.from(socket.rooms.values()).some((r) => r === room);
        if (roomExists) {
            socket.emit(socket_1.RoomEvents.CreateError, 'Room already exists. Please create another room.');
        }
        else {
            yield socket.join(room);
            Room_1.GamePlayers.push(socket.id);
            socket.emit(socket_1.RoomEvents.Created, 'Room created successfully!');
        }
        // ...
    });
    const joinRoom = (room) => __awaiter(void 0, void 0, void 0, function* () {
        const connectedSockets = io.sockets.adapter.rooms.get(room);
        if (!connectedSockets) {
            socket.emit(socket_1.RoomEvents.JoinError, { message: 'Invalid game room!' });
        }
        if (connectedSockets && (connectedSockets === null || connectedSockets === void 0 ? void 0 : connectedSockets.size) >= 2) {
            yield socket.join(room);
            socket.emit(socket_1.RoomEvents.Joined, { message: 'Room joined.', isPlayer: false, isBroadcaster: true });
            socket.to(room).emit(socket_1.RoomEvents.Joined, { message: 'Spectator joined room.', isPlayer: false, isBroadcaster: false });
        }
        else if (connectedSockets && (connectedSockets === null || connectedSockets === void 0 ? void 0 : connectedSockets.size) === 1) {
            yield socket.join(room);
            Room_1.GamePlayers.push(socket.id);
            socket.emit(socket_1.RoomEvents.Joined, { message: 'Connected to game!', isPlayer: true, isBroadcaster: true });
            socket.to(room).emit(socket_1.RoomEvents.Joined, { message: 'Opponent joined room.', isPlayer: true, isBroadcaster: false });
        }
    });
    const updateRoom = (spectatorCount) => __awaiter(void 0, void 0, void 0, function* () {
        const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);
        socket.to(gameRoom).emit(socket_1.RoomEvents.Update, spectatorCount);
    });
    socket.on(socket_1.RoomEvents.Create, createRoom);
    socket.on(socket_1.RoomEvents.Join, joinRoom);
    socket.on(socket_1.RoomEvents.Update, updateRoom);
};
exports.default = roomHandlers;
