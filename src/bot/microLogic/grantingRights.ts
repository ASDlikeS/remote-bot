import { checkGrantingRight } from '../conditions/checkGrantingRight';
import { checkIsPremium } from '../conditions/checkIsPremium';
import {
    setTotalTimeOfPromotion,
    setPromoteUser,
    setDemoteUser,
    getUserInfo,
    setUserBannedStatus,
} from '../../database/db';

export const grantingRights = (id: number, message: string, action: string): string | void => {
    const gottenUserInfo = checkGrantingRight(id, message);
    if (!gottenUserInfo)
        throw new Error(
            "There's issue with fetching data please contact with the developer of this bot",
        );

    if (action === 'addTime') {
        if (checkIsPremium(gottenUserInfo.userId).includes('❌')) {
            throw new Error(
                `❕ This user doesn't have a premium status! \n\n💯${gottenUserInfo.userName}\nYou can't add time for non-premium users! If you want to promote this user please use 🙈 /promote_usr command `,
            );
        } else {
            setTotalTimeOfPromotion(gottenUserInfo.userId, gottenUserInfo.additionTimeHrs);
            return `✅ User ${gottenUserInfo.userName} has gotten additional time more than before he had one. \n\n🆔USER_ID:${gottenUserInfo.userId}\n${gottenUserInfo.message}`;
        }
    }

    if (action === 'promote') {
        if (checkIsPremium(gottenUserInfo.userId).includes('✅')) {
            throw new Error(
                `❕ This user already has premium status! \n\n💯${gottenUserInfo.userName}\n If you want to demote this user please use 🙈 /demote_usr command `,
            );
        } else {
            setPromoteUser(gottenUserInfo.userId, gottenUserInfo.additionTimeHrs);
            return `✅ User ${gottenUserInfo.userName} has been promoted to premium. \n\n🆔USER_ID:${gottenUserInfo.userId}\n${gottenUserInfo.message}`;
        }
    }

    if (action === 'demote') {
        if (checkIsPremium(gottenUserInfo.userId).includes('❌')) {
            throw new Error(
                `❕ This user hasn't got premium status! \n\n💯${gottenUserInfo.userName}\n If you want to promote this user please use 🙈 /promote_usr command `,
            );
        } else {
            setDemoteUser(gottenUserInfo.userId);
            return `❗ User ${gottenUserInfo.userName} has lost his premium status. \n\n🆔USER_ID:${gottenUserInfo.userId}`;
        }
    }

    if (action === 'ban') {
        const value = getUserInfo(gottenUserInfo.userId);
        setUserBannedStatus(gottenUserInfo.userId, !value.is_banned);
        //prettier-ignore
        return value.is_banned ? `❗ User ${gottenUserInfo.userName} has been unbanned.` : `✅ User ${gottenUserInfo.userName} has been banned.`;
    }
};
