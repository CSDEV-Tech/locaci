import type { RentType, Role } from '../features/shared/types';
import { env } from '~/env/client.mjs';
import { searchSchema } from './validation-schemas/search-schema';
import { z } from 'zod';
import type { Metadata } from 'next';

/**
 * get the title for a property
 * @param item
 * @returns
 */
export function getPropertyTitle(item: {
    noOfRooms: number;
    rentType: RentType;
}) {
    const type = item.noOfRooms === 1 ? 'Studio' : 'Appartement';

    const label =
        item.rentType === 'SHORT_TERM'
            ? 'meublé'
            : item.rentType === 'SHARED_APPARTMENT'
            ? 'en colocation'
            : 'Non meublé';

    return `${type} ${label}`;
}

export function getHostWithScheme(url: string): string {
    const urlObject = new URL(url);
    return urlObject.protocol + '//' + urlObject.host;
}

export function wait(ms: number): Promise<void> {
    // Wait for the specified amount of time
    return new Promise(resolve => setTimeout(resolve, ms));
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

/**
 * Compare 2 strings case-insensitive and accent-insensitive
 *
 * @example
 *      compareStrIgnoreAccent('hôpital', 'hopital'); // true
 *      compareStrIgnoreAccent('hôpita', 'hopital'); // false
 *
 * @param str1
 * @param str2
 * @returns
 */
export function compareStrIgnoreAccent(str1?: string, str2?: string) {
    const first = str1
        ?.normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLocaleLowerCase();

    const second = str2
        ?.normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLocaleLowerCase();

    return first === second;
}

/**
 * Return a lowercase string of a string with possible accents and different case
 *
 * @example
 *      convertAccentStringToNormalString('hôpital') // 'hopital'
 *      compareStrIgnoreAccent('Hôpital') //  'hopital'
 *
 * @param str
 * @returns
 */
export function convertAccentStringToNormalString(str: string) {
    return str
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLocaleLowerCase();
}

/**
 * Get the extension of the filename
 *
 * @example
 *  getFileExtension("file-name.webp"); // "webp"
 *
 * @param fileName
 * @returns
 */
export function getFileExtension(fileName: string) {
    const splitted = fileName.split('.');
    return splitted[splitted.length - 1];
}

/**
 * check a file is a native DOM File instance
 *
 * @param fileObject
 */
export function isNativeDOMFile(
    fileObject: File | { uri: string; fileType: 'image' | 'document' }
): fileObject is File {
    return fileObject instanceof File;
}

/**
 * convert a given date to the begin of the day of the date, to ignore hours
 *
 * @example
 *      convertDateToBeginOfDate(new Date('2022-10-12T22:31:43.293Z')) // => Date { '2022-10-12T00:00:00.000Z' }
 *
 * @param date
 * @returns
 */
export function convertDateToBeginOfDate(date: Date) {
    return new Date(
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    );
}

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
export function getAbsoluteURLForImage(imageURL: string) {
    if (imageURL.startsWith('https')) {
        return imageURL;
    }

    return `${env.NEXT_PUBLIC_SITE_URL}${imageURL}`;
}

export function getRoleURL(role: Role) {
    switch (role) {
        case 'ADMIN':
            return `/admin`;
        case 'PROPERTY_OWNER':
            return `/owner`;
        default:
            return '/profile';
    }
}

/**
 * capitalize a string
 *
 * @example
 *      capitalize('abidjan'); // => "Abidjan"
 * @param str
 */
export function capitalize(str: string) {
    const firstLetter = str.charAt(0);
    const rest = str.slice(1);

    return `${firstLetter.toUpperCase()}${rest}`;
}

/**
 * Check if user agent if a phone or tablet
 * @returns
 */
export function isMobileOrTablet() {
    const ua = navigator.userAgent;
    const mobileUserAgent = /IEMobile|Windows Phone|Lumia/i.test(ua)
        ? 'w'
        : /iPhone|iP[oa]d/.test(ua)
        ? 'i'
        : /Android/.test(ua)
        ? 'a'
        : /BlackBerry|PlayBook|BB10/.test(ua)
        ? 'b'
        : /Mobile Safari/.test(ua)
        ? 's'
        : /webOS|Mobile|Tablet|Opera Mini|\bCrMo\/|Opera Mobi/i.test(ua)
        ? 1
        : false;
    const isTablet = /Tablet|iPad/i.test(ua);

    return Boolean(mobileUserAgent) || isTablet;
}

export type SearchQueryParams = z.infer<typeof searchSchema>;

/**
 * Parse URL Search Params to an object
 *
 * @param searchParams
 * @returns
 */
export function parseSearchParams(
    searchParams: URLSearchParams | Record<string, string | undefined>
): SearchQueryParams {
    if (searchParams instanceof URLSearchParams) {
        const municipalitySearchQuery = searchParams.get(
            'municipalityId[label]'
        );
        const municipalityId = searchParams.get('municipalityId[value]');
        return searchSchema.parse({
            ...Object.fromEntries(searchParams.entries()),
            municipalityId,
            municipalityQuery: municipalitySearchQuery,
            amenities: searchParams.getAll('amenities')
        });
    } else {
        const municipalityQuery = searchParams['municipalityId[label]'] ?? null;
        const municipalityId = searchParams['municipalityId[value]'] ?? null;

        return searchSchema.parse({
            ...searchParams,
            municipalityId,
            municipalityQuery,
            amenities: searchParams['amenities'] ?? []
        });
    }
}

export function getTitleForSearchParams(searchParams: SearchQueryParams) {
    let title = 'Recherche ';

    if (searchParams.maxNoOfRooms) {
        title +=
            searchParams.maxNoOfRooms === 1
                ? ' de studios '
                : " d'appartements ";
    } else {
        title += ' de logements ';
    }

    if (searchParams.rentType) {
        title +=
            searchParams.rentType === 'SHORT_TERM'
                ? 'meublés'
                : searchParams.rentType === 'SHARED_APPARTMENT'
                ? 'en colocation'
                : 'non meublés';
    }

    if (searchParams.municipalityQuery) {
        title += ` à "${searchParams.municipalityQuery}"`;
    } else {
        title += ' dans toutes les régions';
    }

    return title;
}

/**
 * get the excerpt of a text, if the text is longer that the maxLength,
 * it returns the text + an ellipsis (...)
 * @param text
 * @param maxLength
 */
export function excerpt(text: string, maxLength: number = 100) {
    return `${text.substring(0, maxLength)}${
        text.length > maxLength ? '...' : ''
    }`;
}

/**
 * get metadata for generateMetadata function
 * @param props
 * @returns
 */
export function getMetadata(props: {
    title?: string;
    description?: string;
    imageURL?: string;
    type?: 'website' | 'article';
    articlePublishedAt?: Date;
    path?: string;
    noIndex?: boolean;
}): Metadata {
    const title =
        props.title ?? 'Trouvez votre prochain Logement en quelques clics';
    const description = props.description
        ? excerpt(props.description)
        : "Découvrez le premier site de recherche et gestion locative de Côte d'Ivoire, pour les bailleurs & locataires.";

    const metaImgURL = props.imageURL
        ? getAbsoluteURLForImage(props.imageURL)
        : `${env.NEXT_PUBLIC_SITE_URL}/logo.png`;

    const contentType = props.type ?? 'website';

    const url = props.path ?? '/';

    return {
        metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
        alternates: {
            canonical: url
        },
        description,
        title,
        robots: {
            index: !Boolean(props.noIndex)
        },
        openGraph: props.noIndex
            ? undefined
            : {
                  title,
                  description,
                  type: contentType,
                  publishedTime: props.articlePublishedAt?.toDateString(),
                  images: [
                      {
                          url: metaImgURL
                      }
                  ]
              },
        twitter: props.noIndex
            ? undefined
            : {
                  title,
                  description,
                  card: 'summary_large_image',
                  images: [
                      {
                          url: metaImgURL
                      }
                  ]
              }
    };
}

export function getCanonical(path: string) {}
