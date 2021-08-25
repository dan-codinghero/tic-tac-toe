module.exports = (io, socket) => {
    const restartGame = async ({ room, isPlayerTurn }) => {
        socket.emit('restart-game:success', {
            message: 'Game Restarted!',
        });
        console.log({ isPlayerTurn });
        socket.emit('game:restart', { isPlayerTurn });
        socket.to(room).emit('game:restart', { isPlayerTurn: !isPlayerTurn });

        // ...
    };
    const updateGame = async ({ room, updatedTiles }) => {
        socket.emit('update-game:success', {
            message: 'Play completed!',
        });
        socket.to(room).emit('game:update', { updatedTiles });

        // ...
    };

    const endGame = async ({ room, updatedTiles, scores, winner }) => {
        socket.emit('end-game:success', {
            message: 'Game completed!',
        });
        socket.to(room).emit('game:end', { updatedTiles, scores, winner });

        // ...
    };

    socket.on('update-game', updateGame);
    socket.on('restart-game', restartGame);
    socket.on('end-game', endGame);
};
