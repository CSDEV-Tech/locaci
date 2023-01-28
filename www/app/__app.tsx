import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { Toaster } from 'react-hot-toast';
import { TailwindIndicator } from '~/www/features/shared/components/tailwind-indicator';
import { env } from '~/www/lib/env.server';

export async function loader() {
    return json({
        PUBLIC_SITE_URL: env.PUBLIC_SITE_URL,
        isProd: env.NODE_ENV === 'production'
    });
}
export default function DefaultLayout() {
    const data = useLoaderData<typeof loader>();
    return (
        <>
            <Outlet />
            <Toaster position="top-center" />
            {!data.isProd && <TailwindIndicator />}
        </>
    );
}
