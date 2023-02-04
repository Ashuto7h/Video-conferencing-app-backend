/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable multiline-comment-style */
import { Router } from 'express';
import { createNewMeet } from '../controllers/meet';
import { getIO } from '../socketInstance';
import { getTimeStamp } from '../utils/utils';

const meetRouter = new Router();
const io = getIO();
meetRouter.get('/create', createNewMeet);

io.on('connection', (socket) => {
  socket.on('join-room', (userData) => {
    const { roomID, userID } = userData;
    socket.join(roomID);
    socket.to(roomID).emit('new-user-connect', userData);
    socket.join(roomID);
    socket.to(roomID).emit('new-user-connect', userData);

    socket.on('disconnect', () => {
      socket.to(roomID).emit('user-disconnected', userID);
    });

    socket.on('broadcast-message', (message) => {
      io.to(roomID).emit('new-broadcast-messsage', {
        ...message,
        timeStamp: getTimeStamp(),
        userData,
      });
    });

    socket.on('video-off', (id) => {
      socket.to(roomID).emit('toggle-video', { id, status: { video: false } });
    });
    socket.on('video-on', (id) => {
      socket.to(roomID).emit('toggle-video', { id, status: { video: true } });
    });
  });
});
export { meetRouter };
