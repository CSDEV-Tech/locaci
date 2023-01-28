import type { MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { env } from '../../lib/env.server';
import { getMetaTags } from '../../lib/meta';

export const meta: MetaFunction<typeof loader> = ({ data }) =>
    getMetaTags({
        baseURL: data.PUBLIC_SITE_URL,
        title: 'Recherche'
    });

export async function loader() {
    return json({
        PUBLIC_SITE_URL: env.PUBLIC_SITE_URL,
        isProd: env.NODE_ENV === 'production'
    });
}

export default function OtherPage() {
    return (
        <>
            <h1 className="text-2xl font-bold">Other page</h1>
            <Link className="underline" to="/" rel="noreferrer">
                Go home
            </Link>
        </>
    );
}
