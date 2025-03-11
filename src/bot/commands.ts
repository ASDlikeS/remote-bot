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
    notAllowed,
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
                ...Markup.keyboard([
                    ['File 🖥️', 'Manuals 📝', 'Help ⚠️', 'Remote control 🚇', 'Premium ✨'],
                ]).resize(),
            });
            await premiumTimer(ctx);
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
    bot.hears('Premium ✨', async (ctx) => {
        try {
            await premiumTimer(ctx);
        } catch (error) {
            handleError(ctx, error as string);
        }
    });

    bot.command('help', (ctx) => {
        ctx.reply(helpMessage, { parse_mode: 'MarkdownV2' });
    });
    bot.hears('Help ⚠️', (ctx) => {
        ctx.reply(helpMessage, { parse_mode: 'MarkdownV2' });
    });

    bot.command('info_about_premium', (ctx) => {
        ctx.reply(infoAboutPrem, { parse_mode: 'HTML' });
    });
    bot.command('contribution', (ctx) => {
        ctx.reply(contribution, { parse_mode: 'HTML' });
    });
    //---------------------------------------------------------------------------------------------------------------------
    // Commands for Admins only
    //---------------------------------------------------------------------------------------------------------------------
    bot.command('promote_usr', async (ctx) => {
        try {
            const gottenInfo = await grantingRights(ctx.from.id, ctx.message.text, 'promote');
            ctx.reply(gottenInfo as string);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('demote_usr', async (ctx) => {
        try {
            const gottenInfo = await grantingRights(ctx.from.id, ctx.message.text, 'demote');
            ctx.reply(gottenInfo as string);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('add_time_usr', async (ctx) => {
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
    bot.hears('Check your connection 🔌', (ctx) => {
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

    bot.command('restart', async (ctx) => {
        await ctx.reply(
            '⚠️ Are you sure, that you want to shutdown? ⚠️',
            Markup.inlineKeyboard([
                [Markup.button.callback('Yes 👍', 'confirm_reboot')],
                [Markup.button.callback('No 👎', 'cancel_reboot')],
            ]),
        );
    });
    bot.command('Reboot ⚡', async (ctx) => {
        await ctx.reply(
            '⚠️ Are you sure, that you want to shutdown? ⚠️',
            Markup.inlineKeyboard([
                [Markup.button.callback('Yes 👍', 'confirm_reboot')],
                [Markup.button.callback('No 👎', 'cancel_reboot')],
            ]),
        );
    });

    bot.action('confirm_reboot', async (ctx) => {
        try {
            const response = sendCommand('restart', ctx.from.id);
            ctx.reply(response);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.action('cancel_reboot', async (ctx) => {
        try {
            const response = sendCommand('restart', ctx.from.id);
            ctx.reply(response);
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });

    bot.command('shutdown', async (ctx) => {
        await ctx.reply(
            '⚠️ Are you sure, that you want to shutdown? ⚠️',
            Markup.inlineKeyboard([
                [Markup.button.callback('Yes 👍', 'confirm_shutdown')],
                [Markup.button.callback('No 👎', 'cancel_shutdown')],
            ]),
        );
    });
    bot.hears('Power Off ⚡', async (ctx) => {
        await ctx.reply(
            '⚠️ Are you sure, that you want to shutdown? ⚠️',
            Markup.inlineKeyboard([
                [Markup.button.callback('Yes 👍', 'confirm_shutdown')],
                [Markup.button.callback('No 👎', 'cancel_shutdown')],
            ]),
        );
    });
    //CONFIRMATION OF SHUTDOWN
    bot.action('confirm_shutdown', async (ctx) => {
        try {
            sendCommand('shutdown', ctx.from!.id);
            await ctx.editMessageText('✅ Shutting down...');
        } catch (error) {
            await ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.action('cancel_shutdown', async (ctx) => {
        await ctx.editMessageText('❌ Cancelled.');
    });
    //---------------------------------------------------------------------------------------------------------------------
    // COMMANDS FOR PREMIUM USERS ONLY
    //---------------------------------------------------------------------------------------------------------------------
    bot.command('bind', async (ctx) => {
        const allowance = await checkIsPremium(ctx.from.id);
        if (allowance.includes('✅')) {
            ctx.reply(`It's comming soon....💤`);
        }
        ctx.reply(notAllowed, { parse_mode: 'HTML' });
    });
    bot.command('volume', async (ctx) => {
        try {
            const allowance = await checkIsPremium(ctx.from.id);
            if (allowance.includes('✅')) {
                const response = splittingCommand(ctx.from.id, 'volume', ctx.message.text);
                ctx.reply(response as string);
            }
            ctx.reply(notAllowed, { parse_mode: 'HTML' });
        } catch (err) {
            ctx.reply(err as string);
        }
    });
    bot.command('mute', async (ctx) => {
        try {
            const allowance = await checkIsPremium(ctx.from.id);
            if (allowance.includes('✅')) {
                const response = sendCommand('mute', ctx.from.id);
                ctx.reply(response);
            }
            ctx.reply(notAllowed, { parse_mode: 'HTML' });
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
    bot.command('unmute', async (ctx) => {
        try {
            const allowance = await checkIsPremium(ctx.from.id);
            if (allowance.includes('✅')) {
                const response = sendCommand('unmute', ctx.from.id);
                ctx.reply(response);
            }
            ctx.reply(notAllowed, { parse_mode: 'HTML' });
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
}
