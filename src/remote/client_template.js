const clientId = 'CLIENT_ID_PLACEHOLDER';

const { WebSocket } = require('ws');
const { spawn } = require('child_process');
const nircmd = require('nircmd');

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
    console.log("You are connected to the bot! Let's remote! Your PC: " + process.platform);
    ws.send(JSON.stringify({ type: 'register', clientId }));
});

ws.on('message', (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData.type === 'command') {
        const isWindows = process.platform === 'win32';
        switch (parsedData.action) {
            case 'screenshot': {
                if (isWindows) {
                    spawn('powershell', [
                        '-Command',
                        'Add-Type -AssemblyName System.Drawing; ' +
                            '$screen = [System.Windows.Forms.Screen]::PrimaryScreen; ' +
                            '$bounds = $screen.Bounds; ' +
                            '$bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height; ' +
                            '$graphics = [System.Drawing.Graphics]::FromImage($bitmap); ' +
                            '$graphics.CopyFromScreen($bounds.X, $bounds.Y, 0, 0, $bitmap.Size); ' +
                            '$bitmap.Save("screenshot.png", [System.Drawing.Imaging.ImageFormat]::Png);',
                    ]);
                } else {
                    spawn('scrot', ['screenshot.png']);
                }
                break;
            }
            case 'volume': {
                if (isWindows) {
                    const volumeLevel = Math.round(parsedData.message * 655.35);
                    nircmd('setsysvolume', volumeLevel);
                } else {
                    spawn('pactl', ['set-sink-volume', '@DEFAULT_SINK@', `${parsedData.message}%`]);
                }
                break;
            }
            case 'mute': {
                if (isWindows) {
                    nircmd('mutesysvolume', parsedData.message ? '1' : '0');
                } else {
                    spawn('pactl', [
                        'set-sink-mute',
                        '@DEFAULT_SINK@',
                        parsedData.message ? '1' : '0',
                    ]);
                }
                break;
            }
        }
    }
});
