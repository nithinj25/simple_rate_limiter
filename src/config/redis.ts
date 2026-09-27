import Redis from 'ioredis';

export const redisClient = new Redis('redis://localhost:6379');

redisClient.on('connect', () => console.log('✅ Redis Connected'));
redisClient.on('error', (err) => console.error('❌ Redis Error:', err));