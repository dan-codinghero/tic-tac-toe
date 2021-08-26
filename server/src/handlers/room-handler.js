module.exports = (io, socket) => {
    const createRoom = async (room, callback) => {
        const roomExists = Array.from(socket.rooms.values()).some((r) => r === room);
        if (roomExists) {
            socket.emit('create-room:error', {
                message: 'Room already exists! Please create another room',
            });
        } else {
            await socket.join(room);
            console.log({ socketAfterCreate: io.sockets.adapter.rooms.get(room) });
            socket.emit('create-room:success', {
                message: 'Room created',
            });
        }

        // ...
    };

    const joinRoom = async (room) => {
        const connectedSockets = io.sockets.adapter.rooms.get(room);
        console.log('player is joining', socket.id);
        if (connectedSockets?.size === 2) {
            console.log('Too many connections');
            socket.emit('join-room:error', {
                message: 'Room is full! Please join another room',
            });
        } else {
            await socket.join(room);
            console.log('join successful for ', socket.id);

            socket.emit('join-room:success', 'Connected to room!');
            socket.emit('game:start', { isNext: false, isPlayerX: false });
            socket.to(room).emit('join-room:connected', 'Opponent connected to room!');
            socket.to(room).emit('game:start', { isNext: true, isPlayerX: true });
        }

        // ...
    };
    // const exitRoom = async (room) => {
    //     const roomResult = io.sockets.adapter.rooms.get(room);
    //     if (!roomResult) {
    //         socket.emit('exit-room:error', {
    //             message: 'Not a valid room',
    //         });
    //     } else {
    //         await socket.leave(room);
    //         console.log({ socketAfterExit: io.sockets.adapter.rooms.get(room) });
    //         socket.emit('game:exit', 'Room exited');
    //         socket.to(room).emit('game:exit', 'Opponent left the room.');
    //     }

    //     // ...
    // };

    socket.on('create-room', createRoom);
    socket.on('join-room', joinRoom);
};
