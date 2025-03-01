import { Telegraf } from 'telegraf';
import { TELEGRAM_TOKEN } from '../config/env.ts';
import { setupCommands } from './commands.ts';
import { premiumAllowsMiddleware } from './middleWare/premiumAllows.ts';
import { usingAllowsMiddleware } from './middleWare/usingAllows.ts';

// Create a bot instance.
const bot: Telegraf = new Telegraf(TELEGRAM_TOKEN as string);

// bot.use(___MiddleWares___);
bot.use(usingAllowsMiddleware);
bot.use(premiumAllowsMiddleware);
//Setup commands.
setupCommands(bot);

// Launch the bot and log to console.
bot.launch()
    .then(() => console.log('Bot launched'))
    .catch((err) => console.error('Error launching bot!', err));

// Stop bot when process is closed.
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
