/**
 * Add a slash to the end of a link that does not contain one
 *
 * @example
 *    linkWithSlash("/mon-lien") // => "/mon-lien/"
 *    linkWithSlash("/mon-lien/") // => "/mon-lien/"
 *
 * @param link
 */
export function linkWithSlash(link: string): string | undefined {
    return link !== undefined ? (link.endsWith('/') ? link : `${link}/`) : link;
}

/**
 * Get the image URL wether it is remote or not
 *
 * @example
 *      getAbsoluteURLForImage(`/logo.svg`) // https://locaci.net/logo.svg
 *      getAbsoluteURLForImage(`https://locaci.fredkiss.dev/logo.svg`) // https://locaci.fredkiss.dev/logo.svg
 * @param url
 */
export function getAbsoluteURLForImage(imageURL: string, baseURL: string) {
    if (imageURL.startsWith('https')) {
        return imageURL;
    }

    return `${baseURL}${imageURL}`;
}

export async function apiFetch<T>(
    url: string,
    options: RequestInit = {}
): Promise<T & { httpStatus: number }> {
    // Set the default headers correctly
    const headers: HeadersInit = new Headers(options.headers);
    headers.set('Accept', 'application/json');
    headers.set(
        'Content-Type',
        headers.get('Content-Type') ?? 'application/json'
    );

    return fetch(url, {
        ...options,
        headers,
        credentials: 'include'
    }).then(async response => {
        // check if data is JSON
        const isJson =
            response.headers
                .get('content-type')
                ?.includes('application/json') ?? false;

        const data = isJson ? await response.json() : null;

        if (!response.ok) {
            console.error(
                `[jsonFetch ${
                    options.method ?? 'GET'
                } ${url}] There was an error :`,
                { data, statusCode: response.status }
            );
        }

        return { ...data, httpStatus: response.status };
    });
}
