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
    experimental: {
        appDir: true,
        enableUndici: true
    },
    reactStrictMode: false,
    swcMinify: true
});

const withBundleAnalyzer = analyze({
    enabled: process.env.ANALYZE === 'true'
});

export default withBundleAnalyzer(nextConfig);
