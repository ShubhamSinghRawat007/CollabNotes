import Note from '../models/Note.js';

export function registerSocketHandlers(io, socket) {
  console.log('Client connected:', socket.id);

  socket.on('join_note', async (noteId) => {
    socket.join(noteId);
    console.log(`Socket ${socket.id} joined note ${noteId}`);

    socket.to(noteId).emit('user_joined', socket.id);

    const clients = await io.in(noteId).fetchSockets();
    const activeUsers = clients.map(client => client.id);
    io.to(noteId).emit('active_users', activeUsers);
  });

  socket.on('note_update', async ({ noteId, content }) => {
    socket.to(noteId).emit('note_updated', content);

    try {
      await Note.findByIdAndUpdate(noteId, {
        content,
        updatedAt: Date.now(),
      });
      console.log('Note updated:', noteId);
    } catch (err) {
      console.error('Error updating note:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    const rooms = [...socket.rooms];
    rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit('user_left', socket.id);
      }
    });
  });
}
