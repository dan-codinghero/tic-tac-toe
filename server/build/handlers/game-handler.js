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
const socket_1 = require("../types/socket");
const gameHandlers = (io, socket) => {
    // const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);
    const restartGame = () => __awaiter(void 0, void 0, void 0, function* () {
        const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);
        socket.to(gameRoom).emit(socket_1.GameEvents.Restart);
    });
    const restartGameAccepted = () => __awaiter(void 0, void 0, void 0, function* () {
        const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);
        socket.to(gameRoom).emit(socket_1.GameEvents.RestartAccepted);
        socket.emit(socket_1.GameEvents.RestartAccepted);
    });
    const updateGame = (action) => __awaiter(void 0, void 0, void 0, function* () {
        const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);
        socket.to(gameRoom).emit(socket_1.GameEvents.Update, Object.assign({}, action));
        // ...
    });
    const endGame = ({ squares, winner }) => __awaiter(void 0, void 0, void 0, function* () {
        const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);
        socket.to(gameRoom).emit(socket_1.GameEvents.End, { squares, winner });
    });
    socket.on(socket_1.GameEvents.Update, updateGame);
    socket.on(socket_1.GameEvents.End, endGame);
    socket.on(socket_1.GameEvents.Restart, restartGame);
    socket.on(socket_1.GameEvents.RestartAccepted, restartGameAccepted);
};
exports.default = gameHandlers;
