// server.js
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
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
  console.log("Servidor de sockets corriendo en http://localhost:4000");
});
