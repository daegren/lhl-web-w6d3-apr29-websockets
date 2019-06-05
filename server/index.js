const WebSocket = require("ws");
const Server = WebSocket.Server;

const wss = new Server({ port: 8081 });

const possibleColors = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "salmon",
  "#CCC"
];
let currentColor = possibleColors[0];

wss.on("connection", ws => {
  console.log("Client Connected");

  const initialMessage = {
    type: "initialMessage",
    currentColor,
    possibleColors
  };

  ws.send(JSON.stringify(initialMessage));

  ws.on("message", data => {
    console.log("Got Data", data);
    const json = JSON.parse(data);

    switch (json.type) {
      case "newColor":
        currentColor = json.newColor;

        const clientMessage = {
          type: "colorChanged",
          color: currentColor
        };

        const jsonToSend = JSON.stringify(clientMessage);

        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(jsonToSend);
          }
        });
        break;

      default:
    }
  });

  ws.on("close", () => {
    console.log("Client Disconnected");
  });
});
