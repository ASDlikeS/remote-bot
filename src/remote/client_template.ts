const clientId = 'CLIENT_ID_PLACEHOLDER';
const ws = new WebSocket('ws://localhost:3001');
ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'register', clientId }));
};
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'command') {
        const isWindows = process.platform === 'win32';
        switch (data.action) {
            case 'screenshot': {
                if (isWindows) {
                    Bun.spawn([
                        'powershell',
                        '-Command',
                        'Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait("{PrtSc"); $bitmap = [System.Windows.Forms.Clipboard]::GetImage(); $bitmap.Save("screenshot.png", "System.Drawing.Imaging.ImageFormat]::Png");',
                    ]);
                } else {
                    Bun.spawn(['scrot', 'screenshot.png']);
                }
                break;
            }
            case 'volume': {
                Bun.spawn(['pactl', 'set-sink-volume', '@DEFAULT_SINK@', `${data.message}%`]);
                break;
            }
        }
    }
};
