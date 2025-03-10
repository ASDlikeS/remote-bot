import { bot } from '../bot';

export const screenshotProc = async (
    screenshotBase64: string | undefined,
    chatId: number,
    message: string,
) => {
    if (screenshotBase64 === undefined) {
        await bot.telegram.sendMessage(
            chatId,
            message.includes('Failed')
                ? message
                : 'For my regret, you may not have a screenshot. Please try again later.',
        );
    } else {
        const screenshotBuffer = Buffer.from(screenshotBase64, 'base64');
        await bot.telegram.sendDocument(chatId, {
            source: screenshotBuffer,
            filename: 'screenshot.jpg',
        });
        await bot.telegram.sendMessage(chatId, message);
    }
};
