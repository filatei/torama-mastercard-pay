const socketIO = require('socket.io');

// user connection map
const userSocketMap = new Map();

function initSocket(server) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('User connected');
    
    socket.on('user login', (user) => {
      console.log(`User logged in: ${user}`);
      userSocketMap.set(user, socket.id); // save the socket id of the user
      io.emit('user login', user);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      userSocketMap.delete(user); // remove the user from the map
    });
  });

  return { io, userSocketMap };
}

module.exports = {
  initSocket,
};
