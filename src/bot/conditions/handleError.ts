import { Context } from 'telegraf';

export const handleError = (ctx: Context, error: string) => {
    ctx.reply(`I'm sorry but\n❓<b>Was gotten some Error:❓</b>\n${error}`, { parse_mode: 'HTML' });
    console.log(
        `id:${ctx.from?.id}\nFullName:${ctx.from?.first_name}\nTelegram NickName: ${ctx.from?.username} has gotten some Error`,
    );
};
