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
