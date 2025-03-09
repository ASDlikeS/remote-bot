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
const { spawn } = require('child_process');
const clientId = `CLIENT_ID_PLACEHOLDER`;

function connectWebSocket() {
    const ws = new WebSocket(`wss://remote-bot-production.up.railway.app`);
    ws.on('open', () => {
        console.log('Successfully connected! 🇷🇺');
        ws.send(JSON.stringify({ type: 'register', clientId }));
    });

    ws.on('message', handleCommand);

    ws.on('error', (err) => console.error('WebSocket error:', err.message));

    ws.on('close', () => {
        console.log('Connection lost. Reconnecting in 10 seconds...');
        setTimeout(connectWebSocket, 10000);
    });
}

const { exec } = require('child_process');

function handleCommand(data) {
    const parsedData = JSON.parse(data);
    const isWindows = process.platform === 'win32';
    //prettier-ignore
    const volume = '& { if (!(Get-Module -ListAvailable -Name AudioDeviceCmdlets)) { Install-Module -Name AudioDeviceCmdlets -Scope CurrentUser -Force -SkipPublisherCheck } ; $vol = ${volume} / 100; (Get-AudioDevice -Playback).Volume = $vol }';
    //prettier-ignore
    const mute = '& { if (!(Get-Module -ListAvailable -Name AudioDeviceCmdlets)) { Install-Module -Name AudioDeviceCmdlets -Scope CurrentUser -Force -SkipPublisherCheck } ; (Get-AudioDevice -Capture).Mute = $true }';

    try {
        switch (parsedData.action) {
            case 'screenshot': {
                if (isWindows) {
                    exec(
                        'powershell -Command "Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing; $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds; $bitmap = New-Object System.Drawing.Bitmap $screen.Width, $screen.Height; $graphics = [System.Drawing.Graphics]::FromImage($bitmap); $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size); $bitmap.Save(\'screenshot.png\', [System.Drawing.Imaging.ImageFormat]::Png)"',
                        (error) => {
                            if (error) console.error('PowerShell Screenshot Failed:', error);
                            else console.log('✅ PowerShell Screenshot Created!');
                        },
                    );
                } else {
                    exec('grim screenshot.png', (err) => {
                        if (err) console.error('Error creating screenshot:', err);
                        else console.log('✅ ScreenShot Created!');
                    });
                }
                break;
            }
            case 'volume': {
                if (isWindows) {
                    spawn(
                        'powershell',
                        ['Command', volume.replace('${volume}', parsedData.message)],
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
                    spawn('powershell', ['Command', mute], {
                        stdio: 'inherit',
                    });
                } else {
                    spawn('pactl', ['set-source-mute', '@DEFAULT_SINK@', '1']);
                }
                break;
            }
            case 'unmute': {
                if (isWindows) {
                    spawn('powershell', ['Command', mute.replace('$true', '$false')], {
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
