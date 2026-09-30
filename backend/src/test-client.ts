import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log('Connected to WebSocket server');
});

ws.on('message', (data) => {
    console.log(JSON.parse(data.toString()));
});

ws.on('close', () => {
    console.log('Disconnected');
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});