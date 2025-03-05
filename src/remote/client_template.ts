const clientId = 'CLIENT_ID_PLACEHOLDER';
const ws = new WebSocket('ws://localhost:3001');
ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'register', clientId }));
};
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'command') {
        switch (data.action) {
            case 'sreenshot': {
                Bun.spawn(['scrot', 'sreenshot.png']);
                break;
            }
            case 'volume': {
                Bun.spawn(['pactl', 'set-sink-volume', '@DEFAULT_SINK@', `${data.message}%`]);
                break;
            }
        }
    }
};
