import express from "express";
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { roomHandler } from "./room";
const { PORT } = process.env;

app.use(cors);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: any) => {
  console.log("user is connected");
  roomHandler(socket);

  socket.on("disconnect", () => {
    console.log("user is disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server working on ${PORT} port`);
});
