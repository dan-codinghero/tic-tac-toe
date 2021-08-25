import { io } from 'socket.io-client';
const SERVER_URI = `${process.env.REACT_APP_SOCKET_IO_SERVER}`;

class SocketConnection {
    socket;

    connect = () => {
        return new Promise((resolve, reject) => {
            this.socket = io(SERVER_URI, {
                // forceNew: false,
                // reconnection: false,
            });
            if (!this.socket) reject('Failed to connect!');

            this.socket.on('connect', () => {
                console.log(`Connected with id: ${this.socket.id}`);
                this._registerListeners(this.socket.id);
                resolve(this.socket);
            });

            this.socket.on('connect_error', (error) => {
                console.log('Error establishing connection!', error);
                // this.close();
                reject(error);
            });
        });
    };

    _registerListeners = (id) => {
        this.socket.on('disconnect', () => {
            console.log(`Disconnected id: ${id}`);
        });
    };

    close = () => {
        this.socket.disconnect();
    };
}

export default new SocketConnection();
