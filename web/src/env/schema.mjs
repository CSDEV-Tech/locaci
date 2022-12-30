// @ts-check
import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
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
    NEXT_REVALIDATE_SECRET: z.string().min(32)
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
    NEXT_PUBLIC_MAPBOX_KEY: z.string(),
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_OAUTH_CLIENT_ID: z.string(),
    NEXT_PUBLIC_OAUTH_ISSUER_BASE_URL: z.string().url(),
    NEXT_PUBLIC_CF_IMAGES_URL: z.string().url(),
    NEXT_PUBLIC_FACEBOOK_APP_ID: z.string().min(1)
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
    NEXT_PUBLIC_MAPBOX_KEY: process.env.NEXT_PUBLIC_MAPBOX_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CF_IMAGES_URL: process.env.NEXT_PUBLIC_CF_IMAGES_URL,
    NEXT_PUBLIC_FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    NEXT_PUBLIC_OAUTH_CLIENT_ID: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
    NEXT_PUBLIC_OAUTH_ISSUER_BASE_URL:
        process.env.NEXT_PUBLIC_OAUTH_ISSUER_BASE_URL
};
