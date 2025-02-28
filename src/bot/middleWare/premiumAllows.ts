import { Context, type MiddlewareFn } from 'telegraf';
import { setDemoteUser } from '../../database/db';
import { remainingTime } from '../microLogic/remainingTime';
import { errorRegistration } from '../../texts/textForCommands';
import { registerUser } from '../../database/db';

export const premiumAllowsMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
    if (ctx.from && ctx.from.id) {
        registerUser(ctx);
        const user = remainingTime(ctx.from.id);

        if (!user.days && !user.hours && !user.minutes && !user.seconds) {
            setDemoteUser(ctx.from.id);
        }
    } else {
        throw new Error(errorRegistration);
    }

    // Continue processing other middleware or commands
    await next();
};
