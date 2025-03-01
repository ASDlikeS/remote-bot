import { Telegraf } from 'telegraf';
import { checkIsPremium } from './conditions/checkIsPremium';
import { handleError } from './conditions/handleError';
import { grantingRights } from './microLogic/grantingRights';
import { startText, infoAboutPrem, helpMessage, contribution } from '../texts/textForCommands';
import { premiumTimer } from './microLogic/dynamicTimer';

export function setupCommands(bot: Telegraf) {
    //---------------------------------------------------------------------------------------------------------------------
    // Commands for All Users
    //---------------------------------------------------------------------------------------------------------------------
    bot.start((ctx) => {
        try {
            ctx.reply(startText.replace('{name}', ctx.from.first_name), {
                parse_mode: 'MarkdownV2',
            });
            premiumTimer(ctx);
        } catch (error) {
            handleError(ctx, error as string);
        }
    });

    bot.command('help', (ctx) => {
        try {
            ctx.reply(helpMessage, { parse_mode: 'MarkdownV2' }); // Send Help Message
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

    bot.command('info_about_premium', (ctx) => {
        try {
            ctx.reply(infoAboutPrem, { parse_mode: 'HTML' });
        } catch (error) {
            handleError(ctx, error as string);
        }
    });

    bot.command('contribution', (ctx) => {
        try {
            ctx.reply(contribution, { parse_mode: 'HTML' });
        } catch (error) {
            handleError(ctx, error as string);
        }
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
    // Test Commands
    //---------------------------------------------------------------------------------------------------------------------
    bot.command('test', (ctx) => {
        // prettier-ignore
        try {
            const userAlreadyChecked = checkIsPremium(ctx.from.id);
            if (userAlreadyChecked.includes('✅')) {
                ctx.reply(`You can use this command ✅`);
            } 
            else {
                throw new Error(`❌ You don't have a Premium Status ❌`);
            }
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
}
