import { Markup, type Context, type Telegraf } from 'telegraf';
import { checkCreatedFile } from '../conditions/checkCreatedFile';
import { generateClientFile } from '../../remote/generateClientFile';
import { unlink } from 'fs/promises';

interface OperSystem {
    os: string;
    type: string;
}

export async function buttonFile(bot: Telegraf, ctx: Context) {
    try {
        ctx.reply(
            'Choose current Operating System: 💻',
            Markup.inlineKeyboard([
                [Markup.button.callback('Windows 💿', 'compile_windows')],
                [Markup.button.callback('Linux 🐧', 'compile_linux')],
                [Markup.button.callback('MacOS 🍎', 'compile_macos')],
            ]),
        );

        bot.action(['compile_windows', 'compile_linux', 'compile_macos'], async (ctx) => {
            const userId = ctx.from.id;
            const os = ctx.match[0].replace('compile_', '');

            let target: OperSystem = {
                os: '',
                type: '',
            };

            switch (os) {
                case 'windows':
                    target = { os: 'win', type: 'exe' };
                    break;

                case 'linux':
                    target = { os: 'linux', type: 'dev' };
                    break;

                case 'macos':
                    target = { os: 'macos', type: 'app' };
                    break;
            }

            const response = checkCreatedFile(userId);

            const binaryFile = await generateClientFile(userId, target);

            ctx.reply(`🔄 Compilation for ${os.toUpperCase()} starts... Wait a few seconds!`);

            await ctx.replyWithDocument({ source: binaryFile });

            await unlink(binaryFile);

            ctx.reply(response, { parse_mode: 'HTML' });
        });
    } catch (error) {
        ctx.reply(error as string, { parse_mode: 'HTML' });
    }
}
