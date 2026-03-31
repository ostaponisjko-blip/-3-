const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];

app.use(express.static("public"));

wss.on("connection", (ws, req) => {
    const ip = req.socket.remoteAddress;
    clients.push(ws);

    console.log("Підключився:", ip);

    broadcast({
        type: "log",
        message: `Підключився: ${ip}`
    });

    updateCount();

    ws.on("message", (data) => {
        const msg = JSON.parse(data);

        if (msg.type === "play_sound") {
            broadcast({ type: "play_sound" });
        }
    });

    ws.on("close", () => {
        clients = clients.filter(c => c !== ws);
        updateCount();
    });
});

function broadcast(data) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function updateCount() {
    broadcast({
        type: "count",
        count: clients.length
    });
}

server.listen(3000, () => {
    console.log("Сервер працює: http://localhost:3000");
});