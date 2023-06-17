export function GET(request: Request) {
    const body = `user-agent: *
Disallow: /profile/*
Disallow: /owner/*`;
    return new Response(body, {
        status: 200,
        headers: {
            'content-type': 'text/plain',
            'cache-control': `public, s-max-age=31536000, immutable`
        }
    });
}
