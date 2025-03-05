import { Telegraf } from 'telegraf';
import { checkIsPremium } from './conditions/checkIsPremium';
import { handleError } from './conditions/handleError';
import { grantingRights } from './microLogic/grantingRights';
import { unlinkSync } from 'fs';
import {
    startText,
    infoAboutPrem,
    helpMessage,
    contribution,
    myRemoteCommands,
} from '../texts/textForCommands';
import { premiumTimer } from './microLogic/dynamicTimer';
import { sendCommand } from '../server/server';
import { checkRemoteCommand } from './conditions/checkRemoteCommand';
import { generateClientFile } from '../remote/generateClientFile';

export function setupCommands(bot: Telegraf) {
    //---------------------------------------------------------------------------------------------------------------------
    // Commands for All Users
    //---------------------------------------------------------------------------------------------------------------------
    bot.start((ctx) => {
        try {
            ctx.reply(startText.replace('{name}', ctx.from.first_name), {
                parse_mode: 'MarkdownV2',
            });
            const fileName = generateClientFile(ctx.from.id);
            ctx.replyWithDocument({ source: fileName });
            premiumTimer(ctx);
            setTimeout(() => {
                unlinkSync(fileName);
            }, 100);
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
            ctx.reply(')))))))))))');
        } catch (error) {
            handleError(ctx, error as string);
        }
    });
    //---------------------------------------------------------------------------------------------------------------------
    // FREE COMMANDS FOR ALL USERS
    //---------------------------------------------------------------------------------------------------------------------
    bot.command('screenshot', (ctx) => {
        try {
            sendCommand('screenshot', ctx.from.id);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });

    bot.command('close', (ctx) => {
        try {
            sendCommand('close', ctx.from.id);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });

    bot.command('restart', (ctx) => {
        try {
            sendCommand('restart', ctx.from.id);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });

    bot.command('shutdown', (ctx) => {
        try {
            sendCommand('shutdown', ctx.from.id);
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
}
