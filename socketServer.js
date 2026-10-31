// server.js
import { createServer } from "http";
import express from "express";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";

const app = express();
const httpServer = createServer(app);

const JWT_SECRET = process.env.NEXTAUTH_SECRET;

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: (process.env.ALLOWED_ORIGIN ?? "http://localhost:3000")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ── Auth middleware: validate NextAuth JWT on connection ──
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication error: missing token"));
  }

  if (!JWT_SECRET) {
    console.error("NEXTAUTH_SECRET is not set — cannot verify tokens");
    return next(new Error("Server configuration error"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.data.userId = decoded.userId ?? decoded.sub;
    if (!socket.data.userId) {
      return next(new Error("Authentication error: no userId in token"));
    }
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return next(new Error("Authentication error: invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  console.log(`Cliente conectado: ${socket.id} (user: ${userId})`);

  // ── Join a conversation room ──
  socket.on("join", (conversationId) => {
    if (!conversationId || typeof conversationId !== "string") return;
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined room: ${conversationId}`);
  });

  // ── Leave a conversation room ──
  socket.on("leave", (conversationId) => {
    if (!conversationId || typeof conversationId !== "string") return;
    socket.leave(conversationId);
    console.log(`Socket ${socket.id} left room: ${conversationId}`);
  });

  // ── Message: emit only to the conversation room ──
  socket.on("message", ({ conversationId, ...msg }) => {
    if (!conversationId) return;

    // Broadcast to everyone in the room EXCEPT the sender
    socket.to(conversationId).emit("message", {
      ...msg,
      senderId: userId,
    });

    console.log(`Mensaje en room ${conversationId} de ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id} (user: ${userId})`);
  });
});

const PORT = process.env.SOCKET_PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Servidor de sockets corriendo en el puerto ${PORT}`);
});
