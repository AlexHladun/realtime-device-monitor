import { WebSocketServer } from 'ws';
import { DeviceSimulator } from './simulator';

const PORT = 8080;

const wss = new WebSocketServer({
    port: PORT,
});

const devices = Array.from(
    { length: 5 },
    (_, index) =>
        new DeviceSimulator({
            id: `device-${index + 1}`,
        }),
);

function broadcast(message: string): void {
    for (const client of wss.clients) {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    }
}

for (const device of devices) {
    device.start((update) => {
        broadcast(JSON.stringify(update));
    });
}

console.log(`WebSocket server is running on ws://localhost:${PORT}`);