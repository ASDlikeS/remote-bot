import type { Context } from 'telegraf';
import { checkIsPremium } from '../conditions/checkIsPremium';

export const premiumTimer = async (ctx: Context): Promise<void> => {
    const initialText = checkIsPremium(ctx.from!.id);
    const sentMessage = await ctx.reply(checkIsPremium(ctx.from!.id), { parse_mode: 'HTML' });

    if (initialText.includes('❌')) {
        return;
    }

    const chatId = ctx.chat?.id;
    const messageId = sentMessage.message_id;
    if (!chatId) {
        console.error(
            `user : ${ctx.from?.username} has gotten new Error with chatId: ${chatId} chatId isn't defined`,
        );
        throw new Error(
            '🚫 I`m sorry but I can`t find your chat id, please contact support https://github.com/ASDlikeS/remote-bot',
        );
    }
    const timerInterval = setInterval(async () => {
        try {
            const newTime = checkIsPremium(ctx.from!.id);
            if (newTime.includes('✅')) {
                await ctx.telegram.editMessageText(chatId, messageId, undefined, newTime, {
                    parse_mode: 'HTML',
                });
            } else {
                clearInterval(timerInterval);
                await ctx.telegram.deleteMessage(chatId, messageId);
                await ctx.reply(newTime, { parse_mode: 'HTML' });
            }
        } catch (error) {
            clearInterval(timerInterval);
        }
    }, 1000);
};
3;
