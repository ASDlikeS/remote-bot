import { getUserInfo, setUserCreatedFile } from '../../database/db';

export const checkCreatedFile = (id: number) => {
    const userInfo = getUserInfo(id);

    const currentDateMs: number = Date.now();
    const elapsedTime: number = currentDateMs - userInfo.time_created_file;
    const totalTimeMs: number = 1800000;
    const remainingTimeMs = Math.max(totalTimeMs - elapsedTime, 0);

    const minutes = Math.floor(remainingTimeMs / (1000 * 60));
    const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

    if (userInfo.time_created_file === 0) {
        setUserCreatedFile(id);
        return `⚡⚡⚡ ${userInfo.user_name} you've created a file! You'll be able to create another one in <b>♻️ 30 minutes ♻️</b> 👀.`;
    } else if (elapsedTime <= totalTimeMs) {
        throw new Error(
            `🔴🔴🔴 😖 I'm sorry but you can't create more files yet... <b>Remaining time: 🕙${minutes}:${seconds}🕙</b> 🔴🔴🔴`,
        );
    } else {
        setUserCreatedFile(id);
        return '⚡⚡⚡ You have successfully created your file again. Enjoy it! So You`ll be able to create another one in ♻️ 30 minutes ♻️ 👀';
    }
};
