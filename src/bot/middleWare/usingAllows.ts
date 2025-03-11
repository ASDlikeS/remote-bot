import { Context, type MiddlewareFn } from 'telegraf';
import { checkIsBanned } from '../conditions/checkIsBanned';
import { registerUser } from '../../database/db';

export const usingAllowsMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
    try {
        if (ctx && ctx.from) {
            await registerUser(ctx);
            checkIsBanned(ctx.from.id);
        }
        await next();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        ctx.reply(errorMessage, { parse_mode: 'HTML' });
    }
};
