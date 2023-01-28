// @ts-check
import type { ZodFormattedError } from 'zod';
import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().min(1),
    CACHE_BYPASS: z.string().optional(),
    CACHE_PREFIX: z.string().optional(),
    CACHE_TTL: z.preprocess(val => Number(val), z.number()),
    OSM_SEARCH_URL: z.string().url(),
    JWT_SECRET: z.string().min(32).max(32),
    OAUTH_CLIENT_SECRET: z.string(),
    CF_ACCOUNT_ID: z.string().min(1),
    CF_ACCESS_KEY_ID: z.string().min(1),
    CF_ACCESS_KEY_SECRET: z.string().min(1),
    CF_IMAGES_BUCKET_NAME: z.string().min(1),
    CF_IMAGES_DOMAIN: z.string().min(1),
    PUBLIC_MAPBOX_KEY: z.string(),
    PUBLIC_SITE_URL: z.string().url(),
    PUBLIC_OAUTH_CLIENT_ID: z.string(),
    PUBLIC_OAUTH_ISSUER_BASE_URL: z.string().url(),
    PUBLIC_CF_IMAGES_URL: z.string().url(),
    PUBLIC_FACEBOOK_APP_ID: z.string().min(1)
});

export const formatErrors = (
    errors: ZodFormattedError<Map<string, string>, string>
) =>
    Object.entries(errors)
        // eslint-disable-next-line array-callback-return
        .map(([name, value]) => {
            if (value && '_errors' in value)
                return `${name}: ${value._errors.join(', ')}\n`;
        })
        .filter(Boolean);

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error(
        '❌ Invalid environment variables:\n',
        ...formatErrors(_env.error.format())
    );
    throw new Error('Invalid environment variables');
}

/**
 * Validate that server-side environment variables are not exposed to the client.
 */
for (let key of Object.keys(_env.data)) {
    if (key.startsWith('NEXT_PUBLIC_')) {
        console.warn('❌ You are exposing a server-side env-variable:', key);

        throw new Error('You are exposing a server-side env-variable');
    }
}

export const env = { ..._env.data };
