import { getUserInfo } from '../../database/db';
import { isBanned } from '../../texts/textForCommands';

export const checkIsBanned = (id: number): void => {
    const userInfo = getUserInfo(id);
    if (userInfo.is_banned) {
        throw new Error(isBanned);
    }
};
