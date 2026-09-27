import type { Request, Response, NextFunction } from 'express'
import { diffieHellman } from 'node:crypto';

type RateLimiterChecker = (identifier: string) => Promise<boolean>;

export const rateLimitExpress = (checkLimit: RateLimiterChecker) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const identifier = req.ip || 'unknow_ip';

            const isAllowed = await checkLimit(identifier);

            if(!isAllowed){
                res.status(429).json({
                    error: 'Too many Request',
                    message: 'You have exceeded your rate limit. Try again later'
                });
                return;
            }
            next();
        } catch (error){
            console.error('Rate limit middleware error: ', error);
            next();
        }
    };
};

