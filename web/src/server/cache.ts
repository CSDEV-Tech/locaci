import superjson from 'superjson';
import { type RedisClientType, createClient } from 'redis';

export type CacheKeyValue = string | number | Date;
export type CacheKey = CacheKeyValue[];

export class Cache {
    private static client: RedisClientType;
    private static readonly prefix = process.env.CACHE_PREFIX ?? '';
    private static readonly bypassCache = process.env.CACHE_BYPASS === 'true';

    static async get<T>(
        key: CacheKey,
        getValue: () => Promise<T>,
        custom_ttl_in_seconds?: number
    ): Promise<T> {
        const cacheKey = this.buildCacheKey(key);

        if (this.bypassCache) {
            console.log(`${cacheKey}: Cache Bypass`);
            return getValue();
        }
        if (!this.client || !this.client.isReady) {
            await this.initializeClient();
        }
        const value = await this.client.get(cacheKey);
        if (value) {
            console.log(`${cacheKey}: Cache hit`);

            return superjson.parse<T>(value);
        } else {
            console.log(`${cacheKey}: Cache miss`);
            const newValue = await getValue();
            await this.update(key, newValue, custom_ttl_in_seconds);
            return newValue;
        }
    }

    private static async update(
        key: CacheKey,
        value: any,
        custom_ttl_in_seconds?: number
    ) {
        if (this.bypassCache) {
            return;
        }
        if (!this.client || !this.client.isReady) {
            await this.initializeClient();
        }
        const cacheKey = this.buildCacheKey(key);
        const serializedValue = superjson.stringify(value);
        await this.client.set(cacheKey, serializedValue);
        await this.client.expire(
            cacheKey,
            custom_ttl_in_seconds ?? Number(process.env.CACHE_TTL)
        );
    }

    static async invalidate(key: CacheKey) {
        if (this.bypassCache) {
            return;
        }
        if (!this.client || !this.client.isReady) {
            await this.initializeClient();
        }
        const cacheKey = this.buildCacheKey(key);
        const keys = await this.client.keys(`${cacheKey}*`);
        if (keys.length > 0) {
            await this.client.del(keys);
        }
    }

    static async clear() {
        if (this.bypassCache) {
            return;
        }
        if (!this.client || !this.client.isReady) {
            await this.initializeClient();
        }
        await this.invalidate([]);
    }

    private static async initializeClient() {
        this.client = await createClient({ url: process.env.REDIS_URL });
        await this.client.connect();
    }

    private static buildCacheKey(key: CacheKey) {
        return [this.prefix, ...key]
            .map(element => {
                if (element instanceof Date) {
                    return element.getTime();
                }
                return element;
            })
            .join('_');
    }

    static async dispose() {
        await this.client?.disconnect();
    }
}

// cache keys
export const CacheKeys = {
    properties: {
        prefix: 'properties',
        single: (id: string) => [CacheKeys.properties.prefix, id],
        similar: (id: string) => [CacheKeys.properties.prefix, id, 'similar'],
        recent: () => [CacheKeys.properties.prefix, 'recent']
    },
    municipalities: {
        prefix: 'municipalities',
        all: () => [CacheKeys.municipalities.prefix]
    }
} as const;
