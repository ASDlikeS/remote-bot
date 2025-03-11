import { Markup, Telegraf } from 'telegraf';
import { checkIsPremium } from './conditions/checkIsPremium';
import { handleError } from './conditions/handleError';
import { grantingRights } from './microLogic/grantingRights';
import {
    startText,
    infoAboutPrem,
    helpMessage,
    contribution,
    myRemoteCommands,
    manual,
} from '../texts/textForCommands';
import { premiumTimer } from './microLogic/dynamicTimer';
import { isConnected, sendCommand } from '../server/server';
import { splittingCommand } from './conditions/splittingCommand';
import { buttonFile } from './microLogic/buttonsFIle';

export function setupCommands(bot: Telegraf) {
    //---------------------------------------------------------------------------------------------------------------------
    // Commands for All Users
    //---------------------------------------------------------------------------------------------------------------------
    bot.start(async (ctx) => {
        try {
            ctx.reply(startText.replace('{name}', ctx.from.first_name), {
                parse_mode: 'MarkdownV2',
            });
            await premiumTimer(ctx);
            ctx.reply(
                'Choose one of the options below. If you don\'t know what to do, click on the "Help" option',
                Markup.keyboard([
                    ['File 🖥️', 'Manuals 📝', 'Help ⚠️', 'Commands for remote control 🚇'],
                ]).resize(),
            );
        } catch (error) {
            handleError(ctx, error as string);
        }
    });
    //---------------------------------------------------------------------------------------------------------------------
    // Commands for File generation
    //---------------------------------------------------------------------------------------------------------------------
    bot.command('file', async (ctx) => {
        await buttonFile(bot, ctx);
    });
    bot.hears('File 🖥️', async (ctx) => {
        await buttonFile(bot, ctx);
    });

    bot.command('manuals', (ctx) => {
        ctx.reply(
            'Select the system for which you need a manual: 💻',
            Markup.inlineKeyboard([
                [Markup.button.callback('Windows 📝', 'windows')],
                [Markup.button.callback('Linux 📝', 'linux')],
                [Markup.button.callback('MacOS 📝', 'macos')],
            ]),
        );
        bot.action(['windows', 'linux', 'macos'], async (ctx) => {
            await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
            const choosenSys = ctx.match[0];
            const response = manual(choosenSys);
            ctx.reply(response as string, { parse_mode: 'HTML' });
        });
    });
    bot.hears('Manuals 📝', (ctx) => {
        ctx.reply(
            'Select the system for which you need a manual: 💻',
            Markup.inlineKeyboard([
                [Markup.button.callback('Windows 📝', 'windows')],
                [Markup.button.callback('Linux 📝', 'linux')],
                [Markup.button.callback('MacOS 📝', 'macos')],
            ]),
        );
        bot.action(['windows', 'linux', 'macos'], async (ctx) => {
            await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
            const choosenSys = ctx.match[0];
            const response = manual(choosenSys);
            ctx.reply(response as string, { parse_mode: 'HTML' });
        });
    });
    //---------------------------------------------------------------------------------------------------------------------
    // Commands for All users
    //---------------------------------------------------------------------------------------------------------------------
    bot.command('premium', async (ctx) => {
        try {
            await premiumTimer(ctx);
        } catch (error) {
            handleError(ctx, error as string);
        }
    });
    bot.command('help', (ctx) => {
        ctx.reply(helpMessage, { parse_mode: 'MarkdownV2' }); // Send Help Message to the Chat
    });
    bot.hears('Help ⚠️', (ctx) => {
        ctx.reply(helpMessage, { parse_mode: 'MarkdownV2' }); // Send Help Message to the Chat
    });

    bot.command('info_about_premium', (ctx) => {
        ctx.reply(infoAboutPrem, { parse_mode: 'HTML' });
    });
    bot.command('contribution', (ctx) => {
        ctx.reply(contribution, { parse_mode: 'HTML' });
    });
    bot.command('my_remote', async (ctx) => {
        const myRemote = await checkIsPremium(ctx.from.id);
        ctx.reply(myRemoteCommands(myRemote), { parse_mode: 'HTML' });
    });
    bot.hears('Commands for remote control 🚇', async (ctx) => {
        const myRemote = await checkIsPremium(ctx.from.id);
        ctx.reply(myRemoteCommands(myRemote), { parse_mode: 'HTML' });
    });
    //---------------------------------------------------------------------------------------------------------------------
    // Commands for Admins only
    //---------------------------------------------------------------------------------------------------------------------
    bot.command('promote_usr', async (ctx) => {
        // TODO: DEDUCE FUNCTIONALITY IN SEPARATE FILE
        try {
            const gottenInfo = await grantingRights(ctx.from.id, ctx.message.text, 'promote');
            ctx.reply(gottenInfo as string);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('demote_usr', async (ctx) => {
        // TODO: DEDUCE FUNCTIONALITY IN SEPARATE FILE
        try {
            const gottenInfo = await grantingRights(ctx.from.id, ctx.message.text, 'demote');
            ctx.reply(gottenInfo as string);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('add_time_usr', async (ctx) => {
        // TODO: DEDUCE FUNCTIONALITY IN SEPARATE FILE
        try {
            const gottenInfo = await grantingRights(ctx.from.id, ctx.message.text, 'addTime');
            ctx.reply(gottenInfo as string);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('ban_usr', async (ctx) => {
        try {
            const gottenInfo = await grantingRights(ctx.from.id, ctx.message.text, 'ban');
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
            ctx.reply(response as string);
        } catch (err) {
            ctx.reply(err as string);
        }
    });
    bot.command('mute', (ctx) => {
        try {
            const response = sendCommand('mute', ctx.from.id);
            ctx.reply(response);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('unmute', (ctx) => {
        try {
            const response = sendCommand('unmute', ctx.from.id);
            ctx.reply(response);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
}
