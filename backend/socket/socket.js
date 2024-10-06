const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const messageModel = require('../models/messageModel');
const conversationModel = require('../models/conversationModel');
const app = express({ limit: "1000mb" });
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const getRecipientSocketId = (recipientId) => {
    return connectedUsers[recipientId];
};
const connectedUsers = {}
io.on("connection", (socket) => {
    // console.log("user connected", socket.id);
    const { userId } = socket.handshake.query;

    if (userId != 'undefined') {
        connectedUsers[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(connectedUsers));
    socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
        try {
            await messageModel.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
            await conversationModel.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
            io.to(connectedUsers[userId]).emit("messagesSeen", { conversationId });
        } catch (error) {
            console.log(error);
        }
    });
    // console.log(socket);
    socket.on('disconnect', () => {

        delete connectedUsers[userId];
        io.emit("getOnlineUsers", Object.keys(connectedUsers));

    })

})
module.exports = { io, server, app, getRecipientSocketId };

