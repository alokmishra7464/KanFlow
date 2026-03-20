import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-board", (boardId) => {
        const rooms = socket.rooms;
        if (!rooms.has(boardId)) {  // ← only join if not already in room
            socket.join(boardId);
            console.log(`Socket ${socket.id} joined board ${boardId}`);
        }
    });

    socket.on("leave-board", (boardId) => {
      socket.leave(boardId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};