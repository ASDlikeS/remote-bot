const readline = require('readline');

const green = '\x1b[32m'; // Green
const magenta = '\x1b[35m'; // Purple
const red = '\x1b[31m'; // Red
const reset = '\x1b[0m'; // Reset

const remoteBot = [
    ' THANK YOU FOR USING OUR BOT!!!                          ',
    '                                                         ',
    '                                                         ',
    '██████╗ ███████╗███╗   ███╗ ██████╗ ████████╗███████╗    ',
    '██╔══██╗██╔════╝████╗ ████║██╔═══██╗╚══██╔══╝██╔════╝    ',
    '██████╔╝█████╗  ██╔████╔██║██║   ██║   ██║   ███████╗    ',
    '██╔══██╗██╔══╝  ██║╚██╔╝██║██║   ██║   ██║   ██╔════╝    ',
    '██║  ██║███████╗██║ ╚═╝ ██║╚██████╔╝   ██║   ███████║    ',
    '╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝    ╚═╝   ╚══════╝    ',
    '             ██████╗    ██████╗  ████████╗               ',
    '             ██╔══██╗  ██╔═══██╗ ╚══██╔══╝               ',
    '             ██████╔╝  ██║   ██║    ██║                  ',
    '             ██╔══██╗  ██║   ██║    ██║                  ',
    '             ██████╔╝  ╚██████╔╝    ██║                  ',
    '             ╚═════╝    ╚═════╝     ╚═╝                  ',
];

const asd = [
    '              █████╗ ███████╗██████╗    ',
    '             ██╔══██╗██╔════╝██════██╗  ',
    '             ███████║███████╗██    ██║  ',
    '             ██╔══██║╚════██║██    ██║  ',
    '             ██║  ██║███████║██████╔═╝  ',
    '             ╚═╝  ╚═╝╚══════╝╚═════╝    ',
    ' ',
    'TELEGRAM BOT: https://t.me/asd_remote_bot',
    'GIT HUB REPO: https://github.com/ASDlikeS/remote-bot',
];

const warning = `
${red}WARNING${reset}
This program will allow controlling your computer remotely.
Please make sure you trust the person who sent this message.
If you are not sure what it does, please close this window and do not continue.

[1] Continue 🔌
[2] Close ❌
`;

/**
 * Line by line ASCII art printing function
 * @param {string[]} lines - Array of strings representing each line of the ASCII art
 * @param {string} color   - Color code for the text
 * @param {number} delay   - Delay between lines in milliseconds
 * @param {Function} callback - Callback function when all lines have been printed
 */

function printAsciiArt(lines, color, delay, callback) {
    let index = 0;
    const interval = setInterval(() => {
        if (index >= lines.length) {
            clearInterval(interval);
            if (callback) callback();
            return;
        }
        console.log(color + lines[index] + reset);
        index++;
    }, delay);
}

console.clear();

printAsciiArt(remoteBot, green, 50, () => {
    printAsciiArt(asd, magenta, 50, () => {
        console.log(warning);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Enter 1 to continue or 2 to exit: ', (choice) => {
            if (choice.trim() === '2') {
                console.log('\n❌ Exiting.');
                process.exit(0);
            } else {
                console.log('\n🔌 Connecting to remote server...');
                connectWebSocket();
            }
            rl.close();
        });
    });
});

const WebSocket = require('ws');
const { spawn, exec } = require('child_process');
const clientId = `CLIENT_ID_PLACEHOLDER`;
const fs = require('fs');

function connectWebSocket() {
    const ws = new WebSocket(`wss://remote-bot-production.up.railway.app`);
    // const ws = new WebSocket('ws://localhost:3001');
    ws.on('open', () => {
        console.log('Successfully connected! 🇷🇺');
        ws.send(JSON.stringify({ type: 'register', clientId }));
    });

    ws.on('message', (data) => handleCommand(data, ws));

    ws.on('error', (err) => console.error('WebSocket error:', err.message));

    ws.on('close', () => {
        console.log('Connection lost. Reconnecting in 10 seconds...');
        setTimeout(connectWebSocket, 10000);
    });
}

function screenshot(bool, ws) {
    if (!bool) {
        console.error('PowerShell Screenshot Failed:', error);
        ws.send(
            JSON.stringify({
                type: 'image',
                message: 'PowerShell Screenshot Failed',
                clientId,
            }),
        );
    } else {
        console.log('✅ PowerShell Screenshot Created!');
        fs.readFile('screenshot.png', (err, data) => {
            if (err) {
                console.error('Error reading screenshot ', err);
                ws.send(
                    JSON.stringify({
                        type: 'image',
                        message: 'Error reading screenshot Failed',
                        clientId,
                    }),
                );
                return;
            }
            const imgBase64 = data.toString('base64');
            ws.send(
                JSON.stringify({
                    type: 'image',
                    image: imgBase64,
                    clientId,
                    message: "✅ Here's your screenshot!",
                }),
            );
            fs.unlink('screenshot.png', (err) => {
                if (err) console.error(err);
            });
        });
    }
}

function handleCommand(data, ws) {
    const parsedData = JSON.parse(data);
    const isWindows = process.platform === 'win32';
    //prettier-ignore
    const volume = '& { if (!(Get-Module -ListAvailable -Name AudioDeviceCmdlets)) { Install-Module -Name AudioDeviceCmdlets -Scope CurrentUser -Force -SkipPublisherCheck } ; Import-Module AudioDeviceCmdlets ; Set-AudioDevice -PlaybackVolume ${volume} }';
    //prettier-ignore
    const mute = '& { if (!(Get-Module -ListAvailable -Name AudioDeviceCmdlets)) { Install-Module -Name AudioDeviceCmdlets -Scope CurrentUser -Force -SkipPublisherCheck } ; Import-Module AudioDeviceCmdlets ; Set-AudioDevice -RecordingMute $true }';

    try {
        switch (parsedData.action) {
            case 'screenshot': {
                if (isWindows) {
                    exec(
                        'powershell -Command "Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing; $screens = [System.Windows.Forms.Screen]::AllScreens; $bitmap = New-Object System.Drawing.Bitmap ([System.Windows.Forms.SystemInformation]::VirtualScreen.Width), ([System.Windows.Forms.SystemInformation]::VirtualScreen.Height); $graphics = [System.Drawing.Graphics]::FromImage($bitmap); foreach ($screen in $screens) { $graphics.CopyFromScreen($screen.Bounds.Location, $screen.Bounds.Location, $screen.Bounds.Size) }; $bitmap.Save(\'screenshot.png\', [System.Drawing.Imaging.ImageFormat]::Png)"',
                        (error) => {
                            error ? screenshot(false, ws) : screenshot(true, ws);
                        },
                    );
                } else {
                    exec('grim screenshot.png', (error) => {
                        error ? screenshot(false, ws) : screenshot(true, ws);
                    });
                }
                break;
            }
            case 'volume': {
                if (isWindows) {
                    spawn(
                        'powershell',
                        ['-Command', volume.replace('${volume}', parsedData.message)],
                        {
                            stdio: 'inherit',
                        },
                    );
                } else {
                    spawn('pactl', ['set-sink-volume', '@DEFAULT_SINK@', `${parsedData.message}%`]);
                }
                break;
            }
            case 'mute': {
                if (isWindows) {
                    spawn('powershell', ['-Command', mute], {
                        stdio: 'inherit',
                    });
                } else {
                    spawn('pactl', ['set-source-mute', '@DEFAULT_SINK@', '1']);
                }
                break;
            }
            case 'unmute': {
                if (isWindows) {
                    spawn('powershell', ['-Command', mute.replace('$true', '$false')], {
                        stdio: 'inherit',
                    });
                } else {
                    spawn('pactl', ['set-source-mute', '@DEFAULT_SINK@', '0']);
                }
                break;
            }
            case 'shutdown': {
                if (process.platform === 'win32') {
                    exec('shutdown /s /t 0');
                } else {
                    exec('poweroff');
                }
                break;
            }
            case 'restart': {
                if (process.platform === 'win32') {
                    exec('shutdown /r /t 0');
                } else {
                    exec('reboot');
                }
                break;
            }
        }
    } catch (e) {
        console.log(e);
    }
}
