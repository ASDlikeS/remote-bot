import { userIsNotPremium, userIsPremium } from '../../texts/textForCommands';
import { getUserInfo } from '../../database/db';

export const checkIsPremium = (id: number): string => {
    const user = getUserInfo(id);
    console.log(user.telegram_id + ' ' + id);
    if (user.is_premium) {
        return userIsPremium(id);
    } else {
        return userIsNotPremium;
    }
};
