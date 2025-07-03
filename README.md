# Pong Web-Client + Node.js Bridge

**Präsentation:** Netzwerkarchitektur unter Linux  
**Semester:** 2. Semester  
**Thema:** Kommunikation zwischen TCP- und WebSocket-Clients über eine Bridge

---

## 🌐 Beschreibung

Dieses Projekt ist die **Client-Komponente** eines Pong-Spiels.  
Ein einfacher HTML5-Canvas dient als Oberfläche für das Spiel, gesteuert über die Tastatur.

Da moderne Browser keine TCP-Verbindungen direkt unterstützen, kommt hier eine **Node.js-Bridge** zum Einsatz,  
die WebSocket-Nachrichten vom Browser entgegennimmt und per TCP an den Kotlin-Game-Server weiterleitet.

---

## 🧱 Architekturüberblick

```text
Browser (WebSocket)
     ⇅
Node.js Bridge (WebSocket <-> TCP)
     ⇅
Kotlin TCP Server (GameLogic)

```

💻 Tastatursteuerung

    Spieler 1 (linkes Paddle): W = hoch, S = runter

    Spieler 2 (rechtes Paddle): ↑ = hoch, ↓ = runter

Die Tasten senden einfache Steuerbefehle ("up1", "down2", …) über WebSocket → TCP → Kotlin-Server.
🛠️ Technologien

    Node.js – Bridge & Webserver

    Express – Liefert index.html, index.js usw.

    ws – WebSocket-Server

    net – TCP-Client zum Kotlin-Server

    HTML5 Canvas – Darstellung des Spiels im Browser

    Vanilla JS – keine Frameworks

📁 Projektstruktur

pong-client/
├── public/
│   ├── index.html     # Spielfläche mit Lag/Packet Loss-Reglern
│   ├── index.js       # Client-Logik (WebSocket + Canvas)
│   └── style.css      # Basisschrift, Hintergrund, Layout
├── server.js          # Node.js TCP ↔ WebSocket Bridge
└── README_Client.md   # Diese Datei

▶️ Setup & Ausführen
1. Installiere benötigte Node.js-Pakete

npm install express ws

2. Starte den Bridge-Server

node server.js

Der Server läuft anschließend unter:

http://localhost:3000

🔌 Kommunikation
WebSocket → Node.js

WebClient sendet z. B.:

"up1"

Node.js → Kotlin TCP-Server

Weiterleitung 1:1 als Textbefehl über Port 12345.
Kotlin → JSON-Spielstand → zurück zum Browser:

{
  "ballX": 412,
  "ballY": 220,
  "p1": 180,
  "p2": 200
}

🧪 Optionale Netzwerk-Tests

Der Client unterstützt Lag- und Packet-Loss-Simulation über Regler in der UI:

    Lag (ms): künstliche Verzögerung von Serverdaten

    Packet Loss (%): zufälliges Verwerfen von Nachrichten

Diese Werte werden per JSON über WebSocket an den Node.js-Server übermittelt:

{
  "type": "settings",
  "lag": 150,
  "loss": 10
}

🎓 Ziel & Nutzen (Präsentationskontext)

Diese Client-Komponente demonstriert:

    wie Webtechnologien mit klassischen TCP-Servern verbunden werden können,

    wie Echtzeitdaten (Pong-Spiel) live über eine Bridge synchronisiert werden,

    wie künstliche Netzwerkfehler (Lag, Packet Loss) gezielt simuliert werden können,

    und wie ein Spieleklassiker für Lehrzwecke adaptiert wird.

📝 Lizenz

Dieses Projekt wurde ausschließlich für die Hochschulpräsentation im Modul „Netzwerkarchitektur unter Linux“ (2. Semester) erstellt.
Alle Teile dienen ausschließlich Lehr- und Demonstrationszwecken. Keine kommerzielle Nutzung.
