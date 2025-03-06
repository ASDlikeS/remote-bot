import { notConnected } from '../texts/textForCommands';

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
            const data = JSON.parse(message.toString()); // parse the incoming message as JSON
            if (data.type === 'register' && data.clientId) {
                clients.set(Number(data.clientId), ws); // store the WebSocket in the map with its ID as key
            }
            console.log(`New client connected. There're active clients: ${clients.size}`);
        },
        open(ws) {}, // a socket is opened
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

export const sendCommand = (action: string, id: number, message: string | void): string => {
    const client = clients.get(id);
    if (client) {
        client.send(JSON.stringify({ type: 'command', action, message }));
        return `Command sent successfully! 👍 Thank you for using our bot 💖`;
    } else {
        throw new Error(notConnected);
    }
};

export const isConnected = (id: number): string => {
    const client = clients.get(id);
    if (client) {
        return `Your connection is alive! 🥳\nNow you can use all commands! 😎\n\nFor checking allow commands list just write /my_remote✨`;
    } else {
        throw new Error(
            "😰Well, we can't find your remote system 💻 WE TRYING TO PING THIS ONE...🕜.\n\n <b>‼️Please be sure that you've run configuration file.‼️</b>\nIf it's already done - try again later 🚬 or contact support team 🌌",
        );
    }
};

console.log('Server started');
