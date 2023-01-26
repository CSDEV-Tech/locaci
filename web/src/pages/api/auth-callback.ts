import { createContext } from '~/server/trpc/context';
import { appRouter } from '~/server/trpc/router';
import { env } from '~/env/server.mjs';
import { getRoleURL } from '~/lib/functions';

import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const t = appRouter.createCaller(
        await createContext({
            type: 'api',
            req,
            res
        })
    );

    const code = req.body.code;
    const redirect_to = req.body.code;

    try {
        const { role } = await t.auth.verifyOAuthCode({
            code,
            redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/api/auth-callback`
        });

        return res.redirect(redirect_to ?? getRoleURL(role));
    } catch (error) {
        return res.redirect(`/auth/login?force_login=true`);
    }
}
