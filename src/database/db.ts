import { Database } from 'bun:sqlite';
import { ADMIN_ID } from '../config/env';
import { errorRegistration } from '../texts/textForCommands';
import { isJSDocUnknownTag, transform } from 'typescript';
import { Context } from 'telegraf';

const db = new Database('users.sqlite', { create: true });

interface User {
    id: number;
    telegram_id: number;
    user_name: string;
    first_name: string;
    total_time_ms: number;
    registered_prem_time_ms: number;
    is_premium: boolean;
}

db.exec(`CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	telegram_id INTEGER UNIQUE,
    user_name TEXT,
    first_name TEXT,
	is_premium BOOLEAN DEFAULT FALSE,
    registered_prem_time_ms INTEGER DEFAULT 0,
    total_time_ms INTEGER DEFAULT 0
);`);

export const registerUser = (ctx: Context): void => {
    const id: number = ctx.from?.id as number;
    const userName: string = ctx.from?.username as string;
    const firstName: string = ctx.from?.first_name as string;
    if (typeof (id || userName || firstName) === 'undefined') {
        throw new Error(`Sorry Dude! ${firstName}`); // TODO: trying to catch incorrect datauser's
    } else {
        const infAboutUser = db.prepare(`SELECT * FROM users WHERE telegram_id=?`).get(id);
        if (!infAboutUser) {
            db.prepare(`INSERT INTO users(telegram_id,user_name,first_name) VALUES (?, ?, ?)`).run(
                id as number,
                userName as string,
                firstName as string,
            );
        }
    }
};

//__________________________________GETTERs_______________________________________//

export const getUserInfo = (id: number): User => {
    const stmt = db.prepare(`SELECT * FROM users WHERE telegram_id=?`).get(id);
    if (!stmt) throw new Error(`🔴 Can't find user with such id`);
    return stmt as User;
};

//__________________________________SETTERs_____________________________________//

export const setPromoteUser = (id: number, timeHrs: number): void => {
    const stmt = db.prepare(
        `UPDATE users SET is_premium=TRUE, total_time_ms=?, registered_prem_time_ms=? WHERE telegram_id=?`, // TODO: add date of registration and total time of promotion
    );
    const currentDateMs = Date.now();
    const timeInMs = timeHrs * 60 * 60 * 1000; // convert hours in ms
    stmt.run(timeInMs, currentDateMs, id);
};

export const setDemoteUser = (id: number): void => {
    const stmt = db.prepare(
        `UPDATE users SET is_premium=FALSE, registered_prem_time_ms=0, total_time_ms=0 WHERE telegram_id=?`,
    );
    stmt.run(id);
};

export const setTotalTimeOfPromotion = (id: number, timeHrs: number): void => {
    const stmt = db.prepare(`UPDATE users SET total_time_ms=total_time_ms+? WHERE telegram_id=?`);
    const timeInMs = timeHrs * 60 * 60 * 1000; // convert hours in ms
    stmt.run(timeInMs, id);
};
