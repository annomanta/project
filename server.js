const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

const users = {}; // เก็บชื่อเล่นของ user แต่ละ socket.id

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join", (nickname) => {
        users[socket.id] = nickname; // บันทึกชื่อเล่นตาม socket.id
        console.log(`${nickname} joined`);
        io.emit("message", { sender: "System", text: `${nickname} has joined the chat.` });
    });

    socket.on("chat message", (msg) => {
        io.emit("message", msg);
    });

    socket.on("disconnect", () => {
        const nickname = users[socket.id] || "A user"; // ใช้ชื่อเล่นถ้ามี
        console.log(`${nickname} disconnected`);
        io.emit("message", { sender: "System", text: `${nickname} has left the chat.` });
        delete users[socket.id]; // ลบชื่อเล่นออกจากระบบ
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
