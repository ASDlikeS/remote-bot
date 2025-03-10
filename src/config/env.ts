import dotenv from 'dotenv';

dotenv.config();

export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN as string;
export const ADMIN_ID = process.env.ADMIN_ID;

if (!TELEGRAM_TOKEN) {
    throw new Error('Telegram token is not defined');
}
if (!ADMIN_ID) {
    throw new Error('Admin id is not defined');
}
