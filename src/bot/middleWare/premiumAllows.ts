import { Context, type MiddlewareFn } from 'telegraf';
import { setDemoteUser } from '../../database/db';
import { remainingTime } from '../microLogic/remainingTime';

export const premiumAllowsMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
    try {
        if (ctx && ctx.from) {
            const user = remainingTime(ctx.from.id);
            if (!user.days && !user.hours && !user.minutes && !user.seconds) {
                setDemoteUser(ctx.from.id);
            }
        }
        await next();
    } catch (error) {
        console.log('Error in premium allows middleware:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        ctx.reply(errorMessage, { parse_mode: 'HTML' });
    }
};
