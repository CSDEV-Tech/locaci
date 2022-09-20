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

/**
 * This function allows you to format a date in French format.
 * It takes the date as it is naturally formatted in JS then returns it in French
 *
 * @example
 *    formatDate("2020-05-13T14:04:00.000Z")  // => "13/05/2020"
 *    formatDate(new Date(0), '.') // => "01.01.1970"
 *
 */
export function formatDate(
    date: string | Date,
    separator: string = '/'
): string {
    const dt = new Date(date);

    const day = Intl.NumberFormat('fr-FR', {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 0
    }).format(dt.getDate());

    const month = Intl.NumberFormat('fr-FR', {
        minimumIntegerDigits: 2,
        maximumFractionDigits: 0
    }).format(dt.getMonth() + 1);

    const year = dt.getFullYear();

    return `${day}${separator}${month}${separator}${year}`;
}

/**
 * This function allows you to delay the call of a function after a certain delay,
 * in order not to block the ui when the user performs an action.
 * Each time this function is called befire the defined delay,
 * it cancels its previous execution
 *
 * @example
 *   // usage
 *   const fn = debounce(() => { console.log(...) })
 *
 *   // Only the second one will be executed
 *   fn()
 *   fn()
 *
 * @param callback
 * @param delay
 */
export function debounce<T extends Function>(
    callback: T,
    delay: number = 500
): T {
    let timer: any;
    const fn = (...args: unknown[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            // @ts-ignore
            callback.apply(this, args);
        }, delay);
    };
    return fn as unknown as T;
}
