import { json } from '@remix-run/node';
import type { z } from 'zod';

export function parseSearchParams<T extends any>(
    request: Request,
    schema: z.Schema<T>
): z.TypeOf<typeof schema> {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    const parseResult = schema.safeParse(params);

    if (!parseResult.success) {
        throw json(parseResult.error.flatten(), { status: 400 });
    }

    return parseResult.data;
}
