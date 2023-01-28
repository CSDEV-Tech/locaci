import type { MetaFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from '@remix-run/react';
import { env } from '~/www/lib/env.server';
import { getMetaTags } from '~/www/lib/meta';

import styles from '~/www/tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const meta: MetaFunction<typeof loader> = ({ data }) =>
    getMetaTags({
        baseURL: data.PUBLIC_SITE_URL
    });

export async function loader() {
    return json({
        PUBLIC_SITE_URL: env.PUBLIC_SITE_URL,
        isProd: env.NODE_ENV === 'production'
    });
}

export default function Root() {
    return (
        <html lang="fr" suppressHydrationWarning>
            <head>
                <Meta />
                <Links />
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"></link>
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""></link>
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body suppressHydrationWarning>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
