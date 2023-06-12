import { io, Socket } from 'socket.io-client';

const socket: Socket = io('ws://localhost:5173');

export default socket;
