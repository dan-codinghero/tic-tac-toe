import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '../types/socket';
const SERVER_URI = `${process.env.REACT_APP_SOCKET_IO_SERVER}`;

class SocketConnection {
    public socket: Socket | null = null;

    connect = (): Promise<Socket> => {
        return new Promise((resolve, reject) => {
            this.socket = io(SERVER_URI);

            this.socket.on(SocketEvents.Connect, () => {
                console.log(`Connected with id: ${this.socket!.id}`);

                resolve(this.socket!);
            });

            this.socket.on(SocketEvents.ConnectError, (error) => {
                this.disconnect();
                reject('Unable to establish connection!');
            });
        });
    };

    disconnect = () => {
        this.socket?.disconnect();
    };
}

export default new SocketConnection();
