class GameService {
    async createGameRoom(socket, roomName) {
        return new Promise((resolve, reject) => {
            socket.emit('create-room', roomName);
            socket.on('create-room:success', ({ message }) => resolve(message));
            socket.on('create-room:error', ({ message }) => reject(message));
        });
    }

    async joinGameRoom(socket, roomName) {
        return new Promise((resolve, reject) => {
            socket.emit('join-room', roomName);
            // socket.on('game:start', (message) => console.log(message));
            socket.on('join-room:error', (message) => reject(message));
            socket.on('join-room:success', (message) => resolve(message));
        });
    }

    async restartGame({ socket, room }) {
        return new Promise((resolve, reject) => {
            socket.emit('restart-game', { room });
            socket.on('restart-game:success', ({ message }) => resolve(message));
            socket.on('restart-game:error', ({ message }) => reject(message));
        });
    }
    async updateGame({ socket, room, updatedTiles }) {
        return new Promise((resolve, reject) => {
            socket.emit('update-game', { room, updatedTiles });
            socket.on('update-game:success', ({ message }) => resolve(message));
            socket.on('update-game:error', ({ message }) => reject(message));
        });
    }

    async endGame({ socket, room, updatedTiles, scores, winner }) {
        return new Promise((resolve, reject) => {
            socket.emit('end-game', { room, updatedTiles, scores, winner });
            socket.on('end-game:success', ({ message }) => resolve(message));
            socket.on('end-game:error', ({ message }) => reject(message));
        });
    }
}

export default new GameService();
