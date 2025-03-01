import { userIsPremium } from '../../texts/textForCommands';
import { getUserInfo } from '../../database/db';

export const checkIsPremium = (id: number): string => {
    const user = getUserInfo(id);
    if (user.is_premium) {
        return userIsPremium(id, true);
    } else {
        return userIsPremium(id, false);
    }
};
