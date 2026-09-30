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
        const message = JSON.stringify(update);

        if (Math.random() < 0.1) {
            const delay = 500 + Math.random() * 1500;

            // console.log(
            //     `[DELAYED] ${update.deviceId} seq=${update.sequence} delay=${Math.round(delay)}ms`,
            // );

            setTimeout(() => {
                broadcast(message);
            }, delay);

            return;
        }

        broadcast(message);
    });
}

console.log(`WebSocket server is running on ws://localhost:${PORT}`);