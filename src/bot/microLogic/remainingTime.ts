import { getUserInfo } from '../../database/db';

interface TUserRemainingTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export const remainingTime = (id: number): TUserRemainingTime => {
    const userInfo = getUserInfo(id); // Getting the user's information from the database.

    const currentDateMs = Date.now(); // Current date in milliseconds.
    const elapsedTime = currentDateMs - userInfo.registered_prem_time_ms; // The time elapsed since the user was added to the premium list.
    const remainingTimeMs = Math.max(userInfo.total_time_ms - elapsedTime, 0); // Remaining time for the user.

    // If the remaining time is less than or equal to zero, it means that the user has exceeded their premium period.
    const days = Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24)); // Converting milliseconds to days.
    const hours = Math.floor((remainingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Extracting the fractional part of the day and converting it to hours.
    const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60)); // Extracting the fractional part of the hour and converting it to minutes.
    const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000); // Extracting the fractional part of the minute and rounding it down to seconds.
    return {
        days,
        hours,
        minutes,
        seconds,
    };
};
