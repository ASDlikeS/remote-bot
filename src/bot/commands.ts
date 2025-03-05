import { Telegraf } from 'telegraf';
import { checkIsPremium } from './conditions/checkIsPremium';
import { handleError } from './conditions/handleError';
import { grantingRights } from './microLogic/grantingRights';
import { unlink } from 'fs/promises';
import {
    startText,
    infoAboutPrem,
    helpMessage,
    contribution,
    myRemoteCommands,
} from '../texts/textForCommands';
import { premiumTimer } from './microLogic/dynamicTimer';
import { isConnected, sendCommand } from '../server/server';
import { splittingCommand } from './conditions/splittingCommand';
import { generateClientFile } from '../remote/generateClientFile';

export function setupCommands(bot: Telegraf) {
    //---------------------------------------------------------------------------------------------------------------------
    // Commands for All Users
    //---------------------------------------------------------------------------------------------------------------------
    bot.start(async (ctx) => {
        try {
            await ctx.reply(startText.replace('{name}', ctx.from.first_name), {
                parse_mode: 'MarkdownV2',
            });
            const file = await generateClientFile(ctx.from.id);

            await ctx.replyWithDocument({ source: file });

            premiumTimer(ctx);

            await unlink(file);
        } catch (error) {
            handleError(ctx, error as string);
        }
    });

    bot.command('premium', (ctx) => {
        try {
            premiumTimer(ctx);
        } catch (error) {
            handleError(ctx, error as string);
        }
    });

    bot.command('help', (ctx) => {
        ctx.reply(helpMessage, { parse_mode: 'MarkdownV2' }); // Send Help Message to the Chat
    });
    bot.command('info_about_premium', (ctx) => {
        ctx.reply(infoAboutPrem, { parse_mode: 'HTML' });
    });
    bot.command('contribution', (ctx) => {
        ctx.reply(contribution, { parse_mode: 'HTML' });
    });
    bot.command('my_remote', (ctx) => {
        const myRemote = checkIsPremium(ctx.from.id);
        ctx.reply(myRemoteCommands(myRemote), { parse_mode: 'HTML' });
    });

    //---------------------------------------------------------------------------------------------------------------------
    // Commands for Admins only
    //---------------------------------------------------------------------------------------------------------------------
    bot.command('promote_usr', (ctx) => {
        // TODO: DEDUCE FUNCTIONALITY IN SEPARATE FILE
        try {
            const gottenInfo = grantingRights(ctx.from.id, ctx.message.text, 'promote');
            ctx.reply(gottenInfo as string);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('demote_usr', (ctx) => {
        // TODO: DEDUCE FUNCTIONALITY IN SEPARATE FILE
        try {
            const gottenInfo = grantingRights(ctx.from.id, ctx.message.text, 'demote');
            ctx.reply(gottenInfo as string);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('add_time_usr', (ctx) => {
        // TODO: DEDUCE FUNCTIONALITY IN SEPARATE FILE
        try {
            const gottenInfo = grantingRights(ctx.from.id, ctx.message.text, 'addTime');
            ctx.reply(gottenInfo as string);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('ban_usr', (ctx) => {
        try {
            const gottenInfo = grantingRights(ctx.from.id, ctx.message.text, 'ban');
            ctx.reply(gottenInfo as string);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });

    //---------------------------------------------------------------------------------------------------------------------
    // Command for connect;
    //---------------------------------------------------------------------------------------------------------------------
    bot.command('connect', (ctx) => {
        try {
            const connected = isConnected(ctx.from.id);
            ctx.reply(connected);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    //---------------------------------------------------------------------------------------------------------------------
    // FREE COMMANDS FOR ALL USERS
    //---------------------------------------------------------------------------------------------------------------------
    bot.command('screenshot', (ctx) => {
        try {
            const response = sendCommand('screenshot', ctx.from.id);
            ctx.reply(response);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('close', (ctx) => {
        try {
            const response = sendCommand('close', ctx.from.id);
            ctx.reply(response);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('restart', (ctx) => {
        try {
            const response = sendCommand('restart', ctx.from.id);
            ctx.reply(response);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('shutdown', (ctx) => {
        try {
            const response = sendCommand('shutdown', ctx.from.id);
            ctx.reply(response);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    //---------------------------------------------------------------------------------------------------------------------
    // COMMANDS FOR PREMIUM USERS ONLY
    //---------------------------------------------------------------------------------------------------------------------

    bot.command('bind', (ctx) => {
        ctx.reply(`It's comming soon....💤`);
    });

    bot.command('volume', (ctx) => {
        try {
            const response = splittingCommand(ctx.from.id, 'volume', ctx.message.text);
        } catch (err) {
            ctx.reply(err as string);
        }
    });
}
