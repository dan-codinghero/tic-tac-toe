import { useEffect, useState } from 'react';
import shortUUID from 'short-uuid';
import Game from './components/Game.jsx/Game';
import OnlineGame from './components/Game.jsx/OnlineGame';
import gameService from './services/game-service';
import socketService from './services/socket-service';

function App() {
    const [roomName, setRoomName] = useState();
    const [toastMessage, setToastMessage] = useState('');

    const handleToastMessage = (msg, timer = 2000) => {
        if (msg) {
            setToastMessage(msg);
            setTimeout(() => {
                setToastMessage('');
            }, timer);
        }
    };

    useEffect(() => {
        if (socketService.socket) {
            socketService.socket.on('game:exit', (msg) => {
                handleToastMessage(msg);
                socketService.close();
                setRoomName('');
            });
            socketService.socket.on('join-room:connected', (msg) => {
                handleToastMessage(msg);
            });

            socketService.socket.on('game:start', ({ isNext, isPlayerX }) => {
                console.log('Game started');
            });
        }
    }, [roomName]);

    const handleCreateRoom = async () => {
        try {
            const socket = await socketService.connect();
            const room = shortUUID().generate();

            const message = await gameService.createGameRoom(socket, room);

            console.log(message);
            setRoomName(room);
        } catch (err) {
            handleToastMessage('Unable to create room');
            console.log(err);
        }
    };

    const handleExitRoom = () => {
        socketService.close();
        handleToastMessage('Room exited!');
        socketService.close();
        setRoomName('');
    };

    const handleJoinRoom = async (e) => {
        e.preventDefault();

        const data = new FormData(e.target);
        const room = data.get('gameRoom');
        console.log(`room: ${room}`);
        try {
            const socket = await socketService.connect();

            const msg = await gameService.joinGameRoom(socket, room);
            console.log(msg);
            setRoomName(room);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="bg-black flex flex-col justify-center items-center min-h-screen font-press-start text-white">
            <div className="my-4 text-yellow-600 relative p-4">{toastMessage}</div>
            <div className="my-5">
                {!roomName && (
                    <button onClick={handleCreateRoom} className="border inline-block mb-3 p-2">
                        Invite friend
                    </button>
                )}
                {roomName && <span className="inline-block pl-2 text-xs">Room: {roomName}</span>}
                {!roomName && (
                    <form onSubmit={handleJoinRoom} method="post">
                        <input className="text-black p-3 text-xs" type="text" name="gameRoom" id="" />
                        <button className="border p-2">Join Room</button>
                    </form>
                )}
            </div>
            {roomName ? (
                <OnlineGame socket={socketService.socket} room={roomName} handleExitRoom={handleExitRoom} handleToastMessage={handleToastMessage} />
            ) : (
                <Game handleToastMessage={handleToastMessage} />
            )}
        </div>
    );
}

export default App;
