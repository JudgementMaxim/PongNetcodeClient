const express = require('express');
const WebSocket = require('ws');
const net = require('net');

const app = express();
app.use(express.static('public')); // Bedient index.html, JS, CSS aus /public

const server = app.listen(3000, () => {
    console.log('🌍 Webserver läuft auf http://localhost:3000');
});

// WebSocket-Server auf dem HTTP-Server aufsetzen
const wss = new WebSocket.Server({ server });

// TCP-Verbindung zum Kotlin-GameServer (z. B. auf Port 12345)
const tcp = new net.Socket();
tcp.connect(12345, '127.0.0.1', () => {
    console.log('🎮 Verbunden mit Kotlin Game Server (TCP 12345)');
});

// Einstellungen pro Client: Lag (ms), Paketverlust (%)
const clientSettings = new Map();

// WebSocket-Client verbindet sich
wss.on('connection', (ws) => {
    console.log('🧍 WebClient verbunden');
    clientSettings.set(ws, { lag: 0, loss: 0 });

    ws.on('message', (msg) => {
        const text = msg.toString(); // <- Umwandlung in richtigen Text
        console.log("📩 Von Browser empfangen:", text);

        try {
            const parsed = JSON.parse(text);
            if (parsed.type === 'settings') {
                clientSettings.set(ws, { lag: parsed.lag, loss: parsed.loss });
                console.log(`⚙️ Settings geändert: Lag=${parsed.lag}, Loss=${parsed.loss}`);
                return;
            }
        } catch (err) {
            // kein JSON – also Steuerbefehl
        }

        console.log("➡️ Weiterleitung an Kotlin:", text);
        tcp.write(text + '\n');
    });

    ws.on('close', () => {
        console.log("❌ WebClient getrennt");
        clientSettings.delete(ws);
    });

    ws.on('error', (err) => {
        console.error("💥 WebSocket-Fehler:", err.message);
    });
});

// TCP → WebSocket: Spielstände vom Kotlin-Server verteilen
tcp.on('data', (data) => {
    const message = data.toString();
    console.log("📥 Daten von Kotlin:", message.trim());

    wss.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return;

        const { lag, loss } = clientSettings.get(client) || { lag: 0, loss: 0 };

        // Paketverlust simulieren
        if (Math.random() < loss / 100) {
            console.log("❌ Paket gedroppt (simulierter Loss)");
            return;
        }

        // Lag simulieren
        setTimeout(() => {
            client.send(message);
        }, lag);
    });
});

tcp.on('error', (err) => {
    console.error("🔥 TCP-Fehler:", err.message);
});
