import { checkGrantingRight } from '../conditions/checkGrantingRight';
import { checkIsPremium } from '../conditions/checkIsPremium';
import {
    setTotalTimeOfPromotion,
    setPromoteUser,
    setDemoteUser,
    getUserInfo,
    setUserBannedStatus,
} from '../../database/db';

//prettier-ignore
export const grantingRights = async (id: number, message: string, action: string): Promise<string | void> => {
    const gottenUserInfo = await checkGrantingRight(id, message);
    const isPremium = await checkIsPremium(gottenUserInfo.userId);

    if (!gottenUserInfo)
        throw new Error(
            "There's issue with fetching data please contact with the developer of this bot",
        );

    if (action === 'addTime') {
        if (isPremium.includes('❌')) {
            throw new Error(
                `❕ This user doesn't have a premium status! \n\n💯${gottenUserInfo.userName}\nYou can't add time for non-premium users! If you want to promote this user please use 🙈 /promote_usr command `,
            );
        } else {
            await setTotalTimeOfPromotion(gottenUserInfo.userId, gottenUserInfo.additionTimeHrs);
            return `✅ User ${gottenUserInfo.userName} has gotten additional time more than before he had one. \n\n🆔USER_ID:${gottenUserInfo.userId}\n${gottenUserInfo.message}`;
        }
    }

    if (action === 'promote') {
        if (isPremium.includes('✅')) {
            throw new Error(
                `❕ This user already has premium status! \n\n💯${gottenUserInfo.userName}\n If you want to demote this user please use 🙈 /demote_usr command `,
            );
        } else {
            await setPromoteUser(gottenUserInfo.userId, gottenUserInfo.additionTimeHrs);
            return `✅ User ${gottenUserInfo.userName} has been promoted to premium. \n\n🆔USER_ID:${gottenUserInfo.userId}\n${gottenUserInfo.message}`;
        }
    }

    if (action === 'demote') {
        if (isPremium.includes('❌')) {
            throw new Error(
                `❕ This user hasn't got premium status! \n\n💯${gottenUserInfo.userName}\n If you want to promote this user please use 🙈 /promote_usr command `,
            );
        } else {
            await setDemoteUser(gottenUserInfo.userId);
            return `❗ User ${gottenUserInfo.userName} has lost his premium status. \n\n🆔USER_ID:${gottenUserInfo.userId}`;
        }
    }

    if (action === 'ban') {
        const value = await getUserInfo(gottenUserInfo.userId);
        await setUserBannedStatus(gottenUserInfo.userId, !value.is_banned);
        //prettier-ignore
        return value.is_banned ? `❗ User ${gottenUserInfo.userName} has been unbanned.` : `✅ User ${gottenUserInfo.userName} has been banned.`;
    }
};
