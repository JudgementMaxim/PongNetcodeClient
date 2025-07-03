const socket = new WebSocket("ws://localhost:3000");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

socket.onopen = () => {
    sendSettings?.(); // Nur wenn Lag/Loss-Funktion aktiv ist
};

socket.onmessage = (e) => {
    const state = JSON.parse(e.data);
    draw(state);
};

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        // Spieler 1 (linkes Paddle) – W/S
        case "w":
        case "W":
            socket.send("up1");
            break;
        case "s":
        case "S":
            socket.send("down1");
            break;

        // Spieler 2 (rechtes Paddle) – Pfeiltasten
        case "ArrowUp":
            socket.send("up2");
            break;
        case "ArrowDown":
            socket.send("down2");
            break;
    }
});

function draw(state) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ball
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(state.ballX, state.ballY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Paddle 1 (links)
    ctx.fillRect(20, state.p1, 10, 80);

    // Paddle 2 (rechts)
    ctx.fillRect(720, state.p2, 10, 80);
}
