/**
 * Petit utilitaire pour chainer les classes css en react tout en évitant
 *  les "false" et "null" dans les classes.
 *
 *  @example
 *    const classes = clsx(
 *        "class1",
 *        "class2",
 *        undefined,
 *        {
 *          class3: true,
 *          class4: false,
 *        });
 *     // retournera "class1 class2 class3"
 *
 * @param args
 */
export function clsx(
    ...args: (string | undefined | Record<string, boolean>)[]
): string {
    const classes: string[] = [];
    for (const arg of args) {
        switch (typeof arg) {
            case 'string':
                if (arg) {
                    classes.push(arg);
                }
                break;
            case 'object':
                if (arg) {
                    for (const key in arg) {
                        if (arg[key]) {
                            classes.push(key);
                        }
                    }
                }
                break;
        }
    }
    return classes.join(' ');
}

/*
 * Convertit un montant en centimes en un montant en euros et le formatter correctement
 * @param amount montant en centimes
 */
export function formatNumberToFCFA(amount: number): string {
    return amount.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

/**
 * Generate an array of numbers from start to the end
 *
 * @example
 *      range(1, 5);
 *      // => [1, 2, 3, 4]
 * @param start
 * @param end
 * @returns
 */
export function range(start: number, end: number): number[] {
    return Array.from({ length: end - start }, (_, i) => i + start);
}

/**
 * Get a range of 5 pages no matter which page we are in the pagination,
 *  It returns the pages in the order [n-2, n-1, n, n+1, n+2] when possible
 *  ie: the pages numbers are not negative, and are not greater than the total.
 * @example
 *      getPageRange(1, 10)  // => [1,2,3,4,5]
 *      getPageRange(4, 10)  // => [2,3,4,5,6]
 *      getPageRange(10, 10) // => [6,7,8,9,10]
 * @param currentPage
 * @param nbPages
 */
export function getPageRange(currentPage: number, nbPages: number) {
    const start = Math.max(1, currentPage - 2);
    const end = start + 5;

    let pages: number[];
    if (end <= nbPages) {
        pages = range(start, end);
    } else {
        pages = range(Math.max(1, nbPages - 4), nbPages + 1);
    }

    return pages;
}
