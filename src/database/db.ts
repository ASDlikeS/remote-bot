import { Pool } from 'pg';
import { Context } from 'telegraf';
import { errorRegistration } from '../texts/textForCommands';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/remote_bot',
    ssl: {
        rejectUnauthorized: false,
    },
});

interface User {
    id: number;
    telegram_id: number;
    user_name: string;
    first_name: string;
    total_time_ms: number;
    registered_prem_time_ms: number;
    is_premium: boolean;
    is_banned: boolean;
    time_created_file: number;
}

const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  user_name TEXT,
  first_name TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  registered_prem_time_ms BIGINT DEFAULT 0,
  total_time_ms BIGINT DEFAULT 0,
  is_banned BOOLEAN DEFAULT FALSE,
  time_created_file BIGINT DEFAULT 0
);
`;

pool.query(createTableQuery)
    .then(() => console.log('✅ Table created successfully'))
    .catch((err) => console.error("❌ Couldn't create table", err));

export const registerUser = async (ctx: Context): Promise<void> => {
    const id = ctx.from?.id;
    const userName = ctx.from?.username;
    const firstName = ctx.from?.first_name;
    if (!id || !userName || !firstName) {
        throw new Error(`Sorry Dude! ${firstName}\n${errorRegistration}`);
    } else {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT * FROM users WHERE telegram_id = $1', [id]);
            if (res.rowCount === 0) {
                await client.query(
                    'INSERT INTO users (telegram_id, user_name, first_name) VALUES ($1, $2, $3)',
                    [id, userName, firstName],
                );
            }
        } finally {
            client.release();
        }
    }
};

//__________________________________GETTER_______________________________________//

export const getUserInfo = async (telegramId: number): Promise<User> => {
    const res = await pool.query('SELECT * FROM users WHERE telegram_id = $1', [telegramId]);
    if (res.rowCount === 0) {
        throw new Error(`🔴 Can't find user with such id`);
    }
    return res.rows[0];
};

//__________________________________SETTERs_____________________________________//

export const setPromoteUser = async (telegramId: number, timeHrs: number): Promise<void> => {
    const currentDateMs = Date.now();
    const timeInMs = timeHrs * 60 * 60 * 1000;

    await pool.query(
        `UPDATE users 
       SET is_premium = TRUE, total_time_ms = $1, registered_prem_time_ms = $2 
       WHERE telegram_id = $3`,
        [timeInMs, currentDateMs, telegramId],
    );
};

export const setDemoteUser = async (telegramId: number): Promise<void> => {
    await pool.query(
        `UPDATE users
         SET is_premium = FALSE, total_time_ms = 0, registered_prem_time_ms = 0
         WHERE telegram_id = $1`,
        [telegramId],
    );
};

export const setTotalTimeOfPromotion = async (
    telegramId: number,
    timeHrs: number,
): Promise<void> => {
    const timeInMs = timeHrs * 60 * 60 * 1000;
    await pool.query(
        `UPDATE users
         SET total_time_ms = total_time_ms + $1
         WHERE telegram_id = $2`,
        [timeInMs, telegramId],
    );
};

export const setUserBannedStatus = async (telegramId: number, status: boolean): Promise<void> => {
    await pool.query(
        `UPDATE users 
       SET is_banned = $1 
       WHERE telegram_id = $2`,
        [status, telegramId],
    );
};

export const setUserCreatedFile = async (telegramId: number): Promise<void> => {
    const currentDateMs = Date.now();
    await pool.query(
        `UPDATE users 
       SET time_created_file = $1 
       WHERE telegram_id = $2`,
        [currentDateMs, telegramId],
    );
};
