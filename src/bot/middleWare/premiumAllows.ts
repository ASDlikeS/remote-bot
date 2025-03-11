import { Context, type MiddlewareFn } from 'telegraf';
import { setDemoteUser } from '../../database/db';
import { remainingTime } from '../microLogic/remainingTime';
import { errorRegistration } from '../../texts/textForCommands';

export const premiumAllowsMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
    try {
        if (ctx && ctx.from) {
            const user = await remainingTime(ctx.from.id);
            if (!user.days && !user.hours && !user.minutes && !user.seconds) {
                await setDemoteUser(ctx.from.id);
            }
        } else {
            throw new Error(errorRegistration);
        }
        await next();
    } catch (error) {
        console.error(
            `${ctx.from?.id} ${ctx.from?.username}: get issued with registration (File: premiumAllows.ts)`,
        );
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        ctx.reply(errorMessage, { parse_mode: 'HTML' });
    }
};
