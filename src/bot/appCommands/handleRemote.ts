import { Context, Markup } from 'telegraf';
import { checkIsPremium } from '../conditions/checkIsPremium';
import { myRemoteCommands } from '../../texts/textForCommands';

export const handleRemoteControl = async (ctx: Context) => {
    const myRemote = await checkIsPremium(ctx.from!.id);
    if (myRemote.includes('❌')) {
        ctx.reply(myRemoteCommands(myRemote), {
            parse_mode: 'HTML',
            ...Markup.keyboard([
                [
                    'Check connection 🔌',
                    'Power Off ⚡',
                    'Reboot ⚡',
                    'Screenshot 📷',
                    'Back to menu ↩️',
                ],
            ])
                .oneTime()
                .resize(),
        });
    } else {
        ctx.reply(myRemoteCommands(myRemote), {
            parse_mode: 'HTML',
            ...Markup.keyboard([
                [
                    'Check connection 🔌',
                    'Power Off ⚡',
                    'Reboot ⚡',
                    'Screenshot 📷',
                    'Volume 🔊',
                    'Mute 🚫🎙️',
                    'Unmute 🎙️',
                    'Back to menu ↩️',
                ],
            ])
                .oneTime()
                .resize(),
        });
    }
};
