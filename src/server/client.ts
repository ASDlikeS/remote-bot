const ws = new WebSocket('ws://localhost:3001');

const clientId: number = 1;

ws.onopen = () => {
    console.log('Connected to the server');
    ws.send(JSON.stringify({ type: 'register', clientId }));
};

ws.onmessage = (event) => {
    console.log('Message from server:', event.data);
};

ws.onclose = () => {
    console.log('Connection closed');
};

ws.onerror = (err) => {
    console.error('Error occurred', err);
};
