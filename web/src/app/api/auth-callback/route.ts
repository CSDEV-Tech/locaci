import { createContext } from '~/server/trpc/context';
import { appRouter } from '~/server/trpc/router';
import { env } from '~/env/server.mjs';
import { getRoleURL } from '~/lib/functions';

import { redirect } from 'next/navigation';

export async function GET(req: Request) {
    const headers = new Headers();

    const t = appRouter.createCaller(
        await createContext({
            type: 'api',
            req,
            resHeaders: headers
        })
    );

    const url = new URL(req.url);

    const searchParams = url.searchParams;
    const code = searchParams.get('code')!;
    const redirect_to = searchParams.get('redirect_to')!;

    try {
        const { role } = await t.auth.verifyOAuthCode({
            code,
            redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/api/auth-callback`
        });

        headers.set(
            'location',
            new URL(redirect_to ?? getRoleURL(role), url.origin).toString()
        );

        return new Response(null, {
            status: 302,
            headers
        });
    } catch (error) {
        return redirect(`/auth/login?force_login=true`);
    }
}
