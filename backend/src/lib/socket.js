import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true, // Allow credentials
  },
});

export function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

export function getMembersSocketId(members) {
  const socketIds = [];
  members.forEach((member) => {
    if (userSocketMap[member]) {
      socketIds.push(userSocketMap[member]);
    }
  });
  return socketIds;
}

//used to store user id and socket id
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("User connected ->", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected ->", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
