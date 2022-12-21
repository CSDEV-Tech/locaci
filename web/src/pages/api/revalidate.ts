import { env } from '~/env/server.mjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const querySchema = z.object({
    nextSecret: z.string().min(32),
    path: z.union([z.string().min(1), z.array(z.string().min(1))])
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const query = querySchema.safeParse(req.query);

    if (!query.success) {
        return res.status(400).json({ message: 'Bad Request' });
    }

    const secret = query.data.nextSecret;

    // Check for secret to confirm this is a valid request
    if (secret !== env.NEXT_REVALIDATE_SECRET) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        // this should be the actual path not a rewritten path
        // e.g. for "/blog/[slug]" this should be "/blog/post-1"
        if (!Array.isArray(query.data.path)) {
            await res.revalidate(query.data.path);
        } else {
            for (const urlPath of query.data.path) {
                await res.revalidate(urlPath);
            }
        }
        return res.json({ revalidated: true });
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res
            .status(500)
            .send(
                `Error encountered while revalidating path '${query.data.path}'`
            );
    }
}
