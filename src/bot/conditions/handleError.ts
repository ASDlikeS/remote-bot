import { errorRegistration } from '../../texts/textForCommands';
import { Context } from 'telegraf';

export const handleError = (ctx: Context, error: string) => {
    ctx.reply(error + '\n\n' + errorRegistration, { parse_mode: 'HTML' });
    console.log(
        `id:${ctx.from?.id}\nFullName:${ctx.from?.first_name}\nTelegram NickName: ${ctx.from?.username} has gotten some Error`,
    );
};
