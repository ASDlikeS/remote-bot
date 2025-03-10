import { Telegraf } from 'telegraf';
import { TELEGRAM_TOKEN } from '../config/env.ts';
import { setupCommands } from './commands.ts';
import { premiumAllowsMiddleware } from './middleWare/premiumAllows.ts';
import { usingAllowsMiddleware } from './middleWare/usingAllows.ts';

export const bot: Telegraf = new Telegraf(TELEGRAM_TOKEN as string);

bot.use(usingAllowsMiddleware);
bot.use(premiumAllowsMiddleware);

setupCommands(bot);

bot.launch()
    .then(() => console.log('Bot launched'))
    .catch((err) => console.error('Error launching bot!', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
