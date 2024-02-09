import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    useFactory: async (config: ConfigService) => {
        const store = await redisStore({
            socket: {
                host: config.get<string>('REDIS_HOST'),
                port: parseInt(config.get<string>('REDIS_PORT')!),
            },
        });
        return {
            store: () => store,
        };
    },
    inject: [ConfigService],
};
