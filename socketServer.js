// server.js
import { createServer } from "http";
import express from "express";
import { Server as SocketIOServer } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://redfreelance.cl", "https://www.redfreelance.cl"],
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  socket.on("message", (msg) => {
    console.log("Mensaje recibido:", msg);

    socket.broadcast.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log(`Servidor de sockets corriendo en el puerto 4000`);
});
