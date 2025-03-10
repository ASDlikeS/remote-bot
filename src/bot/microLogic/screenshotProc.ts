import { Telegraf } from 'telegraf';
import { TELEGRAM_TOKEN } from '../../config/env';

const bot = new Telegraf(TELEGRAM_TOKEN);

export const screenshotProc = async (
    screenshot: string | undefined,
    chatId: number,
    message: string,
) => {
    if (screenshot === undefined) {
        await bot.telegram.sendMessage(chatId, message);
    } else {
        await bot.telegram.sendPhoto(chatId, { source: Buffer.from(screenshot, 'base64') });
    }
};
