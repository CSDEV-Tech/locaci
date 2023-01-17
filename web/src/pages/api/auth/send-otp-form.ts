import { NextApiHandler } from 'next';
import SuperJSON from 'superjson';
import { z } from 'zod';
import { env } from '~/env/server.mjs';
import { sendOtpSchema } from '~/lib/validation-schemas/auth-schema';

const handler: NextApiHandler = async (req, res) => {
    const schema = z
        .object({
            __redirectTo: z.string()
        })
        .merge(sendOtpSchema);

    const { email, __redirectTo } = req.body;

    const contentType = req.headers['content-type'];

    const parseRes = schema.safeParse(req.body);
    if (parseRes.success) {
        if (contentType === 'application/json') {
            return res.status(200).json({
                email,
                success: true
            });
        } else {
            return res.redirect(302, __redirectTo ?? '/');
        }
    } else {
        if (contentType === 'application/json') {
            return res.status(400).json(parseRes.error.flatten());
        } else {
            const queryString = new URLSearchParams(
                new URL(__redirectTo, env.NEXT_PUBLIC_SITE_URL)
            );
            queryString.append(
                '__formErrors',
                SuperJSON.stringify(parseRes.error.flatten())
            );

            const url = __redirectTo?.split('?')[0];
            console.log({ queryString: queryString.toString(), __redirectTo });

            return res.redirect(307, `${url ?? '/'}?${queryString.toString()}`);
        }
    }
};

export default handler;
