import { getUserInfo } from '../../database/db';

interface TUserRemainingTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export const remainingTime = async (id: number): Promise<TUserRemainingTime> => {
    const userInfo = await getUserInfo(id);

    const currentDateMs = Date.now();
    const elapsedTime = currentDateMs - userInfo.registered_prem_time_ms;
    const remainingTimeMs = Math.max(userInfo.total_time_ms - elapsedTime, 0);

    const days = Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);
    return {
        days,
        hours,
        minutes,
        seconds,
    };
};
