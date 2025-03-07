import type { Context } from 'telegraf';
import { checkIsPremium } from '../conditions/checkIsPremium';

export const premiumTimer = async (ctx: Context): Promise<void> => {
    // Send first message to the user with the current time and date
    const initialText = checkIsPremium(ctx.from!.id);
    const sentMessage = await ctx.reply(checkIsPremium(ctx.from!.id), { parse_mode: 'HTML' });

    if (initialText.includes('❌')) {
        return;
    }

    const chatId = ctx.chat?.id;
    const messageId = sentMessage.message_id;
    // If user doesn't have premium status, send a message and stop the timer
    if (!chatId) {
        console.error(
            `user : ${ctx.from?.username} has gotten new Error with chatId: ${chatId} chatId isn't defined`,
        );
        throw new Error(
            '🚫 I`m sorry but I can`t find your chat id, please contact support https://github.com/ASDlikeS/remote-bot',
        );
    }
    // Update the message every 3 second
    const timerInterval = setInterval(async () => {
        try {
            const newTime = checkIsPremium(ctx.from!.id);
            // Check if the new time includes "✅" before editing the message
            if (newTime.includes('✅')) {
                await ctx.telegram.editMessageText(chatId, messageId, undefined, newTime, {
                    parse_mode: 'HTML',
                });
            } else {
                // If condition is not met, clear the interval and delete the message
                clearInterval(timerInterval);
                await ctx.telegram.deleteMessage(chatId, messageId);
                // Send announcement message after deleting the previous one
                await ctx.reply(newTime, { parse_mode: 'HTML' });
            }
        } catch (error) {
            clearInterval(timerInterval);
        }
    }, 1000);
};
3;
