import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
let io = new Server();
export const getSocketInstance = () => io;

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });
  return io;
};
