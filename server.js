// 📌 Backend Prototype สำหรับ "Leaxon Chat"
// ✅ ใช้ Node.js + Express + WebSockets เพื่อรองรับการแชทแบบเรียลไทม์

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

let users = {};

io.on('connection', (socket) => {
    console.log('👤 ผู้ใช้เชื่อมต่อ:', socket.id);

    socket.on('join', (username) => {
        users[socket.id] = username;
        io.emit('userList', Object.values(users));
    });

    socket.on('message', (data) => {
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('userList', Object.values(users));
        console.log('❌ ผู้ใช้ตัดการเชื่อมต่อ:', socket.id);
    });
});

server.listen(5000, () => {
    console.log('🚀 เซิร์ฟเวอร์กำลังทำงานที่พอร์ต 5000');
});
