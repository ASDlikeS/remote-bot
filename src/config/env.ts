import dotenv from 'dotenv';

dotenv.config();

export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN as string;
export const ADMIN_ID = process.env.ADMIN_ID;
export const PORT = Number(process.env.PORT);
export const DOMAIN_NAME = process.env.DOMAIN_NAME;

if (!TELEGRAM_TOKEN) {
    throw new Error('Telegram token is not defined');
}
if (!ADMIN_ID) {
    throw new Error('Admin id is not defined');
}
if (!PORT) {
    throw new Error('Admin id is not defined');
}
if (!DOMAIN_NAME) {
    throw new Error('Domain name is not defined');
}
