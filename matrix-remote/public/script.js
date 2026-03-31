const ws = new WebSocket(`ws://${location.host}`);

const logDiv = document.getElementById("log");
const countSpan = document.getElementById("count");
const sound = document.getElementById("sound");
const playBtn = document.getElementById("playBtn");

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "play_sound") {
        if (sound) sound.play();
    }

    if (data.type === "count") {
        if (countSpan) countSpan.textContent = data.count;
    }

    if (data.type === "log") {
        if (logDiv) {
            const p = document.createElement("p");
            p.textContent = data.message;
            logDiv.appendChild(p);
        }
    }
};

if (playBtn) {
    playBtn.onclick = () => {
        ws.send(JSON.stringify({ type: "play_sound" }));
    };
}