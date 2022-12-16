import { env } from './src/env/server.mjs';
import analyze from '@next/bundle-analyzer';
/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
    return config;
}

const nextConfig = defineNextConfig({
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|png|js)',
                locale: false,
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, maxage=31536000, s-maxage=31536000, immutable'
                    }
                ]
            }
        ];
    },
    experimental: {
        appDir: true,
        enableUndici: true
    },
    reactStrictMode: false,
    swcMinify: true,
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: env.CF_IMAGES_DOMAIN
            }
        ]
    }
});

const withBundleAnalyzer = analyze({
    enabled: process.env.ANALYZE === 'true'
});

export default withBundleAnalyzer(nextConfig);
