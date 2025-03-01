import { Telegraf } from 'telegraf';
import { checkGrantingRight } from './conditions/checkGrantingRight';
import { checkIsPremium } from './conditions/checkPremium';
import { handleError } from './conditions/handleError';
import {
    setPromoteUser,
    setDemoteUser,
    setTotalTimeOfPromotion,
    setUserBannedStatus,
    getUserInfo,
} from '../database/db';
import {
    startText,
    infoAboutPrem,
    helpMessage,
    userIsPremium,
    userIsNotPremium,
    contribution,
} from '../texts/textForCommands';

export function setupCommands(bot: Telegraf) {
    //---------------------------------------------------------------------------------------------------------------------
    // Commands for All Users
    //---------------------------------------------------------------------------------------------------------------------
    bot.start((ctx) => {
        try {
            ctx.reply(startText.replace('{name}', ctx.from.first_name), {
                parse_mode: 'MarkdownV2',
            });
            const isPremium = checkIsPremium(ctx.from.id);
            ctx.reply(isPremium, { parse_mode: 'HTML' });
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
            const isPremium = checkIsPremium(ctx.from.id);
            ctx.reply(isPremium, { parse_mode: 'HTML' });
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
        // prettier-ignore
        try {
            const gottenUserInfo = checkGrantingRight(ctx.from.id, ctx.message.text);
            if (!gottenUserInfo)
                throw new Error(
                    "There's issue with fetching data please contact with the developer of this bot",
                );
            if (checkIsPremium(gottenUserInfo.userId) === userIsPremium(ctx.from.id)) {
                throw new Error(
                    `❕ This user already has premium status! \n\n💯${gottenUserInfo.userName}\n If you want to demote this user please use 🙈 /demote_usr command `,
                );
            } 
            else {
                setPromoteUser(gottenUserInfo.userId, gottenUserInfo.additionTimeHrs);
                ctx.reply(
                    `✅ User ${gottenUserInfo.userName} has been promoted to premium. \n\n🆔USER_ID:${gottenUserInfo.userId}\n${gottenUserInfo.message}`,
                );
            }
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });

    bot.command('demote_usr', (ctx) => {
        // TODO: DEDUCE FUNCTIONALITY IN SEPARATE FILE
        // prettier-ignore
        try {
            const gottenUserInfo = checkGrantingRight(ctx.from.id, ctx.message.text);
            if (!gottenUserInfo)
                throw new Error(
                    "There's issue with fetching data please contact with the developer of this bot",
                );
            if (checkIsPremium(gottenUserInfo.userId) === userIsNotPremium) {
                throw new Error(
                    `❕ This user hasn't got premium status! \n\n💯${gottenUserInfo.userName}\n If you want to promote this user please use 🙈 /promote_usr command `,
                );
            } 
            else {
                setDemoteUser(gottenUserInfo.userId);
                ctx.reply(
                    `❗ User ${gottenUserInfo.userName} has lost his premium status. \n\n🆔USER_ID:${gottenUserInfo.userId}`,
                );
            }
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });

    bot.command('addTime_usr', (ctx) => {
        // TODO: DEDUCE FUNCTIONALITY IN SEPARATE FILE
        // prettier-ignore
        try {
            const gottenUserInfo = checkGrantingRight(ctx.from.id, ctx.message.text);
            if (!gottenUserInfo)
                throw new Error(
                    "There's issue with fetching data please contact with the developer of this bot",
                );
            if (checkIsPremium(gottenUserInfo.userId) === userIsNotPremium) {
                throw new Error(
                    `❕ This user hasn't got premium status! \n\n💯${gottenUserInfo.userName}\nYou can't add time for non-premium users! If you want to promote this user please use 🙈 /promote_usr command `,
                );
            } 
            else {
                setTotalTimeOfPromotion(gottenUserInfo.userId, gottenUserInfo.additionTimeHrs);
                ctx.reply(
                    `✅ User ${gottenUserInfo.userName} has gotten additional time more than before he had one. \n\n🆔USER_ID:${gottenUserInfo.userId}\n${gottenUserInfo.message}`,
                );
            }
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });

    bot.command('ban_usr', (ctx) => {
        try {
            const gottenUserInfo = checkGrantingRight(ctx.from.id, ctx.message.text);
            if (!gottenUserInfo)
                throw new Error(
                    "There's issue with fetching data please contact with the developer of this bot",
                );
            else {
                const value = getUserInfo(gottenUserInfo.userId);
                setUserBannedStatus(gottenUserInfo.userId, !value.is_banned);
                value
                    ? ctx.reply(`✅ User ${gottenUserInfo.userName} has been banned.`)
                    : ctx.reply(`❗ User ${gottenUserInfo.userName} has been unbanned.`);
            }
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
