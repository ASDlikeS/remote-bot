import { Telegraf } from 'telegraf';
import { checkGrantingRight } from './conditions/checkGrantingRight';
import { checkIsPremium } from './conditions/checkPremium';
import {
    startText,
    infoAboutPrem,
    helpMessage,
    errorRegistration,
    userIsPremium,
    userIsNotPremium,
} from '../texts/textForCommands';
import {
    registerUser,
    setPromoteUser,
    setDemoteUser,
    setTotalTimeOfPromotion,
} from '../database/db';

export function setupCommands(bot: Telegraf) {
    bot.start((ctx) => {
        try {
            registerUser(ctx); // Register new user in DB
            ctx.reply(startText.replace('{name}', ctx.from.first_name), {
                parse_mode: 'MarkdownV2',
            });
            const isPremium = checkIsPremium(ctx.from.id);
            ctx.reply(isPremium, { parse_mode: 'HTML' });
        } catch (error) {
            ctx.reply(error + '\n\n' + errorRegistration, { parse_mode: 'HTML' });
            console.log(
                `id:${ctx.from.id}\nFullName:${ctx.from.first_name}\nTelegram NickName: ${ctx.from.username} has gotten some Error`,
            );
        }
    });

    bot.command('help', (ctx) => {
        try {
            registerUser(ctx); // Register new user in DB
            ctx.reply(helpMessage, { parse_mode: 'MarkdownV2' }); // Send Help Message
        } catch (error) {
            ctx.reply(error + '\n\n' + errorRegistration, { parse_mode: 'HTML' });
            console.log(
                `id:${ctx.from.id}\nFullName:${ctx.from.first_name}\nTelegram NickName: ${ctx.from.username} has gotten some Error`,
            );
        }
    });

    bot.command('premium', (ctx) => {
        try {
            registerUser(ctx);
            const isPremium = checkIsPremium(ctx.from.id);
            ctx.reply(isPremium, { parse_mode: 'HTML' });
        } catch (error) {
            ctx.reply(error + '\n\n' + errorRegistration, { parse_mode: 'HTML' });
            console.log(
                `id:${ctx.from.id}\nFullName:${ctx.from.first_name}\nTelegram NickName: ${ctx.from.username} has gotten some Error`,
            );
        }
    });

    bot.command('info_about_premium', (ctx) => {
        try {
            registerUser(ctx);
            ctx.reply(infoAboutPrem, { parse_mode: 'HTML' });
        } catch (error) {
            ctx.reply(error + '\n\n' + errorRegistration, { parse_mode: 'HTML' });
            console.log(
                `id:${ctx.from.id}\nFullName:${ctx.from.first_name}\nTelegram NickName: ${ctx.from.username} has gotten some Error`,
            );
        }
    });

    bot.command('promote_usr', (ctx) => {
        try {
            const gottenUserInfo = checkGrantingRight(ctx.from.id, ctx.message.text);
            if (!gottenUserInfo) throw new Error("There's issue with fetching data");
            if (checkIsPremium(gottenUserInfo.userId) === userIsPremium(ctx.from.id)) {
                throw new Error(
                    `❕ This user already has premium status! \n\n💯${gottenUserInfo.userName}\n If you want to demote this user please use 🙈 /demote_usr command `,
                );
            } else {
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
        try {
            const gottenUserInfo = checkGrantingRight(ctx.from.id, ctx.message.text);
            if (!gottenUserInfo) throw new Error("There's issue with fetching data");
            if (checkIsPremium(gottenUserInfo.userId) === userIsNotPremium) {
                throw new Error(
                    `❕ This user hasn't got premium status! \n\n💯${gottenUserInfo.userName}\n If you want to promote this user please use 🙈 /promote_usr command `,
                );
            } else {
                setDemoteUser(gottenUserInfo.userId);
                ctx.reply(
                    `❗ User ${gottenUserInfo.userName} has lost his premium status. \n\n🆔USER_ID:${gottenUserInfo.userId}`,
                );
            }
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });

    bot.command('add_usr_time', (ctx) => {
        try {
            const gottenUserInfo = checkGrantingRight(ctx.from.id, ctx.message.text);
            if (!gottenUserInfo) throw new Error("There's issue with fetching data");
            if (checkIsPremium(gottenUserInfo.userId) === userIsNotPremium) {
                throw new Error(
                    `❕ This user hasn't got premium status! \n\n💯${gottenUserInfo.userName}\nYou can't add time for non-premium users! If you want to promote this user please use 🙈 /promote_usr command `,
                );
            } else {
                setTotalTimeOfPromotion(gottenUserInfo.userId, gottenUserInfo.additionTimeHrs);
                ctx.reply(
                    `✅ User ${gottenUserInfo.userName} has gotten additional time more than before he had one. \n\n🆔USER_ID:${gottenUserInfo.userId}\n${gottenUserInfo.message}`,
                );
            }
        } catch (error) {
            ctx.reply(error as string, { parse_mode: 'HTML' });
        }
    });
}
