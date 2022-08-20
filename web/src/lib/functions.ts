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

/**
 * Get the value of a cookie with the given name and given the cookie string,
 * can be a server cookie or a document cookie
 * @example
 *      getCookie('name', document.cookie);
 *      // => "value"
 * @param name
 * @returns
 */
export function getCookie(name: string, cookieStr: string): string | null {
    const value = `; ${cookieStr}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() ?? null;
    }

    return null;
}
