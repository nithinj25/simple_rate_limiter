import type { Redis } from 'ioredis';
import type { ValidRoutePath } from '../types/routes.ts';
import { privateDecrypt } from 'node:crypto';

type TimeUnit = 'second' | 'minute' | 'hour';

const LUA_RATE_LIMIT_SCRIPT = `
    local current = redis.call("INCR", KEYS[1])
    if current == 1 then 
      redis.call("EXPIRE", KEYS[1], ARGV[1])
    end
    return current
`;

export class RateLimiter {
    private route: ValidRoutePath | '' = '';
    private maxRequests: number = 10;
    private timeWindow: TimeUnit = 'minute';
    private redisClient !: Redis;

    private counstructor() {}

    static forRoute(route: ValidRoutePath): RateLimiter {
        const instance = new RateLimiter();
        instance.route = route;
        return instance;
    }

    limit(max: number): this {
        this.maxRequests = max;
        return this;
    }

    per(unit: TimeUnit): this {
        this.timeWindow = unit;
        return this;
    }

    withRedis(client: Redis): this {
        this.redisClient = client;
        return this;
    }

    private getWindowSeconds(): number{
        switch(this.timeWindow){
            case 'second': return 1;
            case 'minute': return 60;
            case 'hour': return 3600;
        }
    }

    build(){
        const windowSecs = this.getWindowSeconds();

        return async (identifier: string): Promise<boolean> => {
            if(!this.redisClient) throw new Error('Redis client is required');

            const key = `rateLimit: ${this.route}: ${identifier}`;

            const currentCount = await this.redisClient.eval(
                LUA_RATE_LIMIT_SCRIPT,
                1, 
                key,
                windowSecs
            ) as number;

            return currentCount <= this.maxRequests;
        };
    }
}
