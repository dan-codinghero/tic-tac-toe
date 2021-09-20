import { Server, Socket } from 'socket.io';
import { GameServiceAction, Players } from '../types/game';
import { GameEvents } from '../types/socket';

const gameHandlers = (io: Server, socket: Socket) => {
    // const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);

    const restartGame = async () => {
        const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);

        socket.to(gameRoom).emit(GameEvents.Restart);
    };

    const restartGameAccepted = async () => {
        const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);

        socket.to(gameRoom).emit(GameEvents.RestartAccepted);
        socket.emit(GameEvents.RestartAccepted);
    };

    const updateGame = async (action: GameServiceAction) => {
        const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);

        socket.to(gameRoom).emit(GameEvents.Update, { ...action });

        // ...
    };

    const endGame = async ({ squares, winner }: { squares: Players[]; winner: Players }) => {
        const gameRoom = Array.from(socket.rooms.values()).filter((item) => item != socket.id);

        socket.to(gameRoom).emit(GameEvents.End, { squares, winner });
    };

    socket.on(GameEvents.Update, updateGame);
    socket.on(GameEvents.End, endGame);
    socket.on(GameEvents.Restart, restartGame);
    socket.on(GameEvents.RestartAccepted, restartGameAccepted);
};

export default gameHandlers;
