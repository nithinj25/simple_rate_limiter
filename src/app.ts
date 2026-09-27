import express from 'express';
import { redisClient } from './config/redis.ts';
import { RateLimiter } from './lib/RateLimiter.ts';
import { rateLimitExpress } from './middleware/rateLimiterExpress.ts';
import { STATUS_CODES } from 'node:http';

const app = express();

const dataRouteLimite = RateLimiter
    .forRoute('/api/data')
    .limit(5)
    .per('minute')
    .withRedis(redisClient)
    .build();

app.get('/api/data', rateLimitExpress(dataRouteLimite), (req, res) => {
    res.json({ message: 'Success! You are within the limi'});
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});