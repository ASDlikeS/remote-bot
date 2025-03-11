import { getUserInfo } from '../../database/db';
import { isBanned } from '../../texts/textForCommands';

export const checkIsBanned = async (id: number): Promise<void> => {
    const userInfo = await getUserInfo(id);
    if (userInfo.is_banned) {
        throw new Error(isBanned);
    }
};
