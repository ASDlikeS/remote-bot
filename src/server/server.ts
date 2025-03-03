const clients = new Map<number, any>();

Bun.serve({
    fetch(req, server) {
        // upgrade the request to a WebSocket
        if (server.upgrade(req)) {
            return; // do not return a Response
        }
        return new Response('Upgrade failed', { status: 500 });
    },
    port: 3001,
    websocket: {
        message(ws, message) {
            console.log(message);
            const data = JSON.parse(message.toString());

            if (data.type === 'register') {
                clients.set(data.clientId, ws);
                console.log('Client was registered with id: ' + data.clientId);
                console.log("There're active clients: " + clients.size);
            }
        },
        open(ws) {
            console.log('Client was connected');
            ws.send('Hi you are connected!');
        }, // a socket is opened
        close(ws, code, message) {
            for (const [id, client] of clients) {
                if (client === ws) {
                    clients.delete(id);
                    console.log(`Client ${id} disconnected`);
                    break;
                }
            }
            console.log(`There're active clients: ${clients.size}`);
        }, // a socket is closed
    }, // handlers
});

console.log('Server started on http://localhost:3001');
