import { bot } from '../bot';

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
