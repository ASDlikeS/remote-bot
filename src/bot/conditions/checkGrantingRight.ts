import { ADMIN_ID } from '../../config/env';
import { getUserInfo } from '../../database/db';

interface UserInfo {
    userId: number;
    userName: string;
    additionTimeHrs: number;
    message: string;
}

export const checkGrantingRight = (
    idWhoGivesRights: number,
    idToWhomGiveRights: string,
): UserInfo | void => {
    if (idWhoGivesRights !== Number(ADMIN_ID)) {
        throw Error(
            "🔴 <b>The process was forcibly stopped.</b> <pre>You don't have enough permissions to do this action! You aren't an admin.</pre>",
        );
    }
    const gottenMessageId: string[] = idToWhomGiveRights.split(' ');
    const userId: number = Number(gottenMessageId[1]);
    let additionTimeHrs: number = Number(gottenMessageId[2]);

    if (gottenMessageId.length < 2) {
        throw Error(
            '🔴 <b>The process was forcibly stopped.</b><pre>Invalid arguments! Write user id</pre>',
        );
    } else if (isNaN(userId)) {
        throw Error(
            '🔴 <b>The process was forcibly stopped.</b> <pre>Invalid syntax! Write correctly USER ID without spaces</pre>',
        );
    } else if (!additionTimeHrs || additionTimeHrs <= 0 || additionTimeHrs > 1000) {
        additionTimeHrs = 1;
        const userInfo = getUserInfo(userId);
        const userName: string = userInfo.user_name;
        const message: string = `❗ You haven't given any time for user ${userName}. So user ${userName} was been granted premium status for 🕙 1 hour.`;
        return {
            userId,
            userName,
            additionTimeHrs,
            message,
        };
    } else {
        const userInfo = getUserInfo(userId);
        const userName: string = userInfo.user_name;
        const message: string = `📳 You have given for user ${userName} - 🕐 ${additionTimeHrs} hours.`;
        return {
            userId,
            userName,
            additionTimeHrs,
            message,
        };
    }
};
