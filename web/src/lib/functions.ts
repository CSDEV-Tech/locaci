export function getHostWithScheme(url: string): string {
    const urlObject = new URL(url);
    return urlObject.protocol + '//' + urlObject.host;
}

export function wait(ms: number): Promise<void> {
    // Wait for the specified amount of time
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function jsonFetch<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    // Set the default headers correctly
    const headers: HeadersInit = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    // only wait in development mode
    if (process.env.NODE_ENV === 'development') {
        await wait(1500);
    }

    return fetch(url, {
        ...options,
        headers,
        credentials: 'include'
    })
        .then(response => response.json())
        .catch(error => {
            console.error('There was an error ?', error);
        });
}
