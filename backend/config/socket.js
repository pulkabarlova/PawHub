import { Server } from 'socket.io';

/**
 * Singleton Socket.IO server instance.
 * @type {import('socket.io').Server | undefined}
 */
let io;

/**
 * Create and wire the Socket.IO server onto an existing HTTP server.
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
  });

  return io;
}

/** @returns {import('socket.io').Server | undefined} the live io instance */
export const getIo = () => io;

/**
 * Proactively notify every connected client that a new pet is up for adoption.
 * This is the mandatory server -> client WebSocket event the frontend listens for.
 * @param {object} pet the freshly created adoptable pet
 */
export const emitAdoptionAlert = (pet) => {
  io?.emit('new_adoption_alert', pet);
};
