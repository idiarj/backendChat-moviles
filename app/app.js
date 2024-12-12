import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { FsUtils } from "../utils/fsUtils.js";
import { userRouter } from "../routers/dispatcher.js";
const cors_config = await FsUtils.readJsonFile('./config/cors_config.json');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(cors_config));

app.use('/user', userRouter);

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: cors_config.origin,
        credentials: cors_config.credentials
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on('sendMessage', async ({ roomId, message, senderId }) => {
        const chat = await ChatModel.addMessage({ roomId, message, senderId });
        io.to(roomId).emit('receiveMessage', chat);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});