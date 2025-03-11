import { userIsPremium } from '../../texts/textForCommands';
import { getUserInfo } from '../../database/db';

export const checkIsPremium = async (telegramId: number): Promise<string> => {
    const user = await getUserInfo(telegramId);
    if (user.is_premium) {
        return userIsPremium(telegramId, true);
    } else {
        return userIsPremium(telegramId, false);
    }
};
